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
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Message, ContactInquiry } from './types';

/**
 * Get all messages, optionally filtered by target
 */
export const getMessages = async (target?: string): Promise<Message[]> => {
  try {
    const messagesCollection = collection(db, 'messages');
    let q = messagesCollection;
    
    if (target) {
      q = query(messagesCollection, where('target', '==', target));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      message_id: doc.id,
      ...doc.data()
    } as Message));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

/**
 * Get a specific message by ID
 */
export const getMessage = async (messageId: string): Promise<Message | null> => {
  try {
    const messageDoc = doc(db, 'messages', messageId);
    const snapshot = await getDoc(messageDoc);
    
    if (snapshot.exists()) {
      return {
        message_id: snapshot.id,
        ...snapshot.data()
      } as Message;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting message:', error);
    throw error;
  }
};

/**
 * Create a new message
 */
export const createMessage = async (message: Omit<Message, 'message_id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const messagesCollection = collection(db, 'messages');
    const docRef = await addDoc(messagesCollection, {
      ...message,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

/**
 * Update a message
 */
export const updateMessage = async (messageId: string, message: Partial<Message>): Promise<void> => {
  try {
    const messageDoc = doc(db, 'messages', messageId);
    await updateDoc(messageDoc, {
      ...message,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    const messageDoc = doc(db, 'messages', messageId);
    await deleteDoc(messageDoc);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

/**
 * Get all contact inquiries
 */
export const getContactInquiries = async (): Promise<ContactInquiry[]> => {
  try {
    const inquiriesCollection = collection(db, 'contact_inquiries');
    const snapshot = await getDocs(inquiriesCollection);
    return snapshot.docs.map(doc => ({
      inquiry_id: doc.id,
      ...doc.data()
    } as ContactInquiry));
  } catch (error) {
    console.error('Error getting contact inquiries:', error);
    throw error;
  }
};

/**
 * Get a specific contact inquiry by ID
 */
export const getContactInquiry = async (inquiryId: string): Promise<ContactInquiry | null> => {
  try {
    const inquiryDoc = doc(db, 'contact_inquiries', inquiryId);
    const snapshot = await getDoc(inquiryDoc);
    
    if (snapshot.exists()) {
      return {
        inquiry_id: snapshot.id,
        ...snapshot.data()
      } as ContactInquiry;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting contact inquiry:', error);
    throw error;
  }
};

/**
 * Submit a contact inquiry
 */
export const submitContactInquiry = async (inquiry: Omit<ContactInquiry, 'inquiry_id' | 'submission_date' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const inquiriesCollection = collection(db, 'contact_inquiries');
    const docRef = await addDoc(inquiriesCollection, {
      ...inquiry,
      submission_date: serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    throw error;
  }
};

/**
 * Update a contact inquiry
 */
export const updateContactInquiry = async (inquiryId: string, inquiry: Partial<ContactInquiry>): Promise<void> => {
  try {
    const inquiryDoc = doc(db, 'contact_inquiries', inquiryId);
    await updateDoc(inquiryDoc, {
      ...inquiry,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating contact inquiry:', error);
    throw error;
  }
};

/**
 * Delete a contact inquiry
 */
export const deleteContactInquiry = async (inquiryId: string): Promise<void> => {
  try {
    const inquiryDoc = doc(db, 'contact_inquiries', inquiryId);
    await deleteDoc(inquiryDoc);
  } catch (error) {
    console.error('Error deleting contact inquiry:', error);
    throw error;
  }
};

/**
 * Send a broadcast message to all students in an institution
 */
export const sendBroadcastMessage = async (
  title: string,
  content: string,
  institutionId: string
): Promise<string> => {
  try {
    const messagesCollection = collection(db, 'messages');
    const docRef = await addDoc(messagesCollection, {
      title,
      content,
      type: 'broadcast',
      target: institutionId,
      status: 'sent',
      date: serverTimestamp(),
      delivery_rate: 100, // Assuming 100% delivery for now
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error sending broadcast message:', error);
    throw error;
  }
};

/**
 * Send a targeted message to specific students
 */
export const sendTargetedMessage = async (
  title: string,
  content: string,
  studentIds: string[]
): Promise<string[]> => {
  try {
    const messagesCollection = collection(db, 'messages');
    const messagePromises = studentIds.map(studentId => 
      addDoc(messagesCollection, {
        title,
        content,
        type: 'targeted',
        target: studentId,
        status: 'sent',
        date: serverTimestamp(),
        delivery_rate: 100, // Assuming 100% delivery for now
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      })
    );
    
    const results = await Promise.all(messagePromises);
    return results.map(result => result.id);
  } catch (error) {
    console.error('Error sending targeted messages:', error);
    throw error;
  }
};
