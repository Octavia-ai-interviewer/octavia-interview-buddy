
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { CreditCard, DollarSign, Clock, Calendar, Wallet, Plus, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingControls = () => {
  const { toast } = useToast();
  const [licenseCount, setLicenseCount] = useState(1000);
  const [licensesToPurchase, setLicensesToPurchase] = useState(100);
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '05/25', default: true }
  ]);
  
  // Pricing constants
  const PRICE_PER_LICENSE_ANNUAL = 19.96; // $19.96 per student annually
  const PRICE_PER_LICENSE_QUARTERLY = 4.99; // $4.99 per student quarterly
  
  const calculateAnnualLicenseCost = (count) => {
    return (count * PRICE_PER_LICENSE_ANNUAL).toFixed(2);
  };
  
  const calculateQuarterlyLicenseCost = (count) => {
    return (count * PRICE_PER_LICENSE_QUARTERLY).toFixed(2);
  };
  
  const handleLicenseChange = (count) => {
    setLicensesToPurchase(count);
  };
  
  const handlePurchaseLicenses = () => {
    setLicenseCount(prev => prev + licensesToPurchase);
    
    toast({
      title: "Purchase successful",
      description: `Added ${licensesToPurchase} student licenses to your institution`,
    });
  };
  
  const handleAddCard = () => {
    setCards([
      ...cards,
      { id: Date.now(), type: 'Mastercard', last4: '8888', expiry: '09/26', default: false }
    ]);
    
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully",
    });
  };
  
  const handleMakeDefault = (id) => {
    setCards(cards.map(card => ({
      ...card,
      default: card.id === id
    })));
    
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been changed",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Purchase Licenses
            </CardTitle>
            <CardDescription>
              Get access to the platform for your students to book interviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="license-purchase">Current licenses:</Label>
                <span className="font-medium">{licenseCount} students</span>
              </div>
              
              <Label htmlFor="license-purchase">Number of licenses to purchase</Label>
              <div className="flex space-x-2">
                <Input
                  id="license-purchase"
                  type="number"
                  min="1"
                  value={licensesToPurchase}
                  onChange={(e) => handleLicenseChange(parseInt(e.target.value) || 100)}
                  className="text-right"
                />
                <span className="flex items-center text-muted-foreground px-2">students</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => handleLicenseChange(100)}>
                100 Licenses
              </Button>
              <Button variant="outline" onClick={() => handleLicenseChange(500)}>
                500 Licenses
              </Button>
              <Button variant="outline" onClick={() => handleLicenseChange(1000)}>
                1000 Licenses
              </Button>
            </div>
            
            <div className="bg-primary/5 p-3 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>Licenses</span>
                <span>{licensesToPurchase} students</span>
              </div>
              <div className="flex justify-between">
                <span>Quarterly cost</span>
                <span>${calculateQuarterlyLicenseCost(licensesToPurchase)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual cost</span>
                <span>${calculateAnnualLicenseCost(licensesToPurchase)}</span>
              </div>
              <div className="h-px bg-primary/10 my-1"></div>
              <div className="flex justify-between font-bold">
                <span>Total annual cost</span>
                <span>${calculateAnnualLicenseCost(licensesToPurchase)}</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">
              <p>Each license gives a student access to the platform to book interview sessions from your shared pool.</p>
              <p className="mt-1">You can purchase additional sessions separately in the Session Pool tab.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handlePurchaseLicenses}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Purchase Licenses
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Manage your payment cards and billing preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell>
                      <div className="font-medium">{card.type} •••• {card.last4}</div>
                    </TableCell>
                    <TableCell>{card.expiry}</TableCell>
                    <TableCell>
                      {card.default ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Default
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Backup
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!card.default && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMakeDefault(card.id)}
                        >
                          Make Default
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleAddCard}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Account Summary
          </CardTitle>
          <CardDescription>
            Overview of your institution's subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-sm">Active Licenses</div>
              <div className="text-2xl font-bold">{licenseCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Students</div>
            </div>
            
            <div className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-sm">Quarterly Cost</div>
              <div className="text-2xl font-bold">${calculateQuarterlyLicenseCost(licenseCount)}</div>
              <div className="text-xs text-muted-foreground mt-1">Next payment: June 1, 2025</div>
            </div>
            
            <div className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-sm">Annual Cost</div>
              <div className="text-2xl font-bold">${calculateAnnualLicenseCost(licenseCount)}</div>
              <div className="text-xs text-muted-foreground mt-1">Per year</div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-md">
            <h3 className="font-medium mb-2">License Benefits</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Each student gets access to the Octavia AI platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Students can book sessions from your shared institution pool</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Access to detailed analytics and performance reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Customizable settings for session allocation and management</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View Invoice History</Button>
          <Button variant="outline">Download Current Invoice</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Billing History
          </CardTitle>
          <CardDescription>
            View your previous invoices and billing transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>March 15, 2025</TableCell>
                <TableCell>Quarterly license payment (1000 students)</TableCell>
                <TableCell>${calculateQuarterlyLicenseCost(1000)}</TableCell>
                <TableCell>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Paid
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Invoice
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>March 10, 2025</TableCell>
                <TableCell>Session purchase (500 sessions)</TableCell>
                <TableCell>$1,125.00</TableCell>
                <TableCell>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Paid
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Invoice
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>December 15, 2024</TableCell>
                <TableCell>Quarterly license payment (1000 students)</TableCell>
                <TableCell>${calculateQuarterlyLicenseCost(1000)}</TableCell>
                <TableCell>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Paid
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Invoice
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingControls;
