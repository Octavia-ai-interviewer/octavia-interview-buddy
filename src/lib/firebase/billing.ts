import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { PaymentMethod, BillingHistory } from './types';

/**
 * Get payment methods for an institution
 */
export const getPaymentMethods = async (institutionId: string): Promise<PaymentMethod[]> => {
  try {
    const methodsCollection = collection(db, 'payment_methods');
    const q = query(methodsCollection, where('institution_id', '==', institutionId));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      payment_method_id: doc.id,
      ...doc.data()
    } as PaymentMethod));
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
};

/**
 * Get a specific payment method by ID
 */
export const getPaymentMethod = async (paymentMethodId: string): Promise<PaymentMethod | null> => {
  try {
    const methodDoc = doc(db, 'payment_methods', paymentMethodId);
    const snapshot = await getDoc(methodDoc);
    
    if (snapshot.exists()) {
      return {
        payment_method_id: snapshot.id,
        ...snapshot.data()
      } as PaymentMethod;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting payment method:', error);
    throw error;
  }
};

/**
 * Add a payment method
 */
export const addPaymentMethod = async (method: Omit<PaymentMethod, 'payment_method_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const methodsCollection = collection(db, 'payment_methods');
    const docRef = await addDoc(methodsCollection, {
      ...method,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

/**
 * Update a payment method
 */
export const updatePaymentMethod = async (paymentMethodId: string, method: Partial<PaymentMethod>): Promise<void> => {
  try {
    const methodDoc = doc(db, 'payment_methods', paymentMethodId);
    await updateDoc(methodDoc, {
      ...method,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (paymentMethodId: string): Promise<void> => {
  try {
    const methodDoc = doc(db, 'payment_methods', paymentMethodId);
    await deleteDoc(methodDoc);
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

/**
 * Set a payment method as default
 */
export const setDefaultPaymentMethod = async (institutionId: string, paymentMethodId: string): Promise<void> => {
  try {
    // First, unset any existing default payment methods
    const methodsCollection = collection(db, 'payment_methods');
    const q = query(
      methodsCollection, 
      where('institution_id', '==', institutionId),
      where('default_payment', '==', true)
    );
    
    const snapshot = await getDocs(q);
    
    // Update all existing default methods to not be default
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { default_payment: false, updated_at: serverTimestamp() })
    );
    
    await Promise.all(updatePromises);
    
    // Set the new default payment method
    const methodDoc = doc(db, 'payment_methods', paymentMethodId);
    await updateDoc(methodDoc, {
      default_payment: true,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

/**
 * Get billing history for an institution
 */
export const getBillingHistory = async (institutionId: string): Promise<BillingHistory[]> => {
  try {
    const historyCollection = collection(db, 'billing_history');
    const q = query(
      historyCollection, 
      where('institution_id', '==', institutionId),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      billing_history_id: doc.id,
      ...doc.data()
    } as BillingHistory));
  } catch (error) {
    console.error('Error getting billing history:', error);
    throw error;
  }
};

/**
 * Get a specific billing record by ID
 */
export const getBillingRecord = async (billingHistoryId: string): Promise<BillingHistory | null> => {
  try {
    const recordDoc = doc(db, 'billing_history', billingHistoryId);
    const snapshot = await getDoc(recordDoc);
    
    if (snapshot.exists()) {
      return {
        billing_history_id: snapshot.id,
        ...snapshot.data()
      } as BillingHistory;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting billing record:', error);
    throw error;
  }
};

/**
 * Add a billing record
 */
export const addBillingRecord = async (record: Omit<BillingHistory, 'billing_history_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const historyCollection = collection(db, 'billing_history');
    const docRef = await addDoc(historyCollection, {
      ...record,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding billing record:', error);
    throw error;
  }
};

/**
 * Update a billing record
 */
export const updateBillingRecord = async (billingHistoryId: string, record: Partial<BillingHistory>): Promise<void> => {
  try {
    const recordDoc = doc(db, 'billing_history', billingHistoryId);
    await updateDoc(recordDoc, {
      ...record,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating billing record:', error);
    throw error;
  }
};

/**
 * Calculate total billing amount for a period
 */
export const calculateBillingTotal = async (institutionId: string, startDate: Date, endDate: Date): Promise<number> => {
  try {
    const historyCollection = collection(db, 'billing_history');
    const q = query(
      historyCollection, 
      where('institution_id', '==', institutionId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const snapshot = await getDocs(q);
    
    // Sum up all amounts
    return snapshot.docs.reduce((total, doc) => {
      const record = doc.data() as BillingHistory;
      return total + record.amount;
    }, 0);
  } catch (error) {
    console.error('Error calculating billing total:', error);
    throw error;
  }
};
