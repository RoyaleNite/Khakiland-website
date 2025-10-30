import { useEffect, useState } from 'react';
import { Container, Box, Grid, Paper, Divider } from '@mui/material';
import { User, MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks/useToast';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import api from '../api/client';
import type { Address } from '../types';

export function ProfilePage() {
  const { user, loadUser } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
  });

  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'South Africa',
    address_type: 'shipping' as 'shipping' | 'billing',
    is_default: false,
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
      });
    }
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/auth/addresses/');
      setAddresses(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch addresses',
      });
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await api.patch('/api/auth/profile/', profileForm);
      await loadUser();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setEditingProfile(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/addresses/', addressForm);
      await fetchAddresses();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Address added successfully',
      });
      setAddingAddress(false);
      resetAddressForm();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add address',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (id: number) => {
    setLoading(true);
    try {
      await api.patch(`/api/auth/addresses/${id}/`, addressForm);
      await fetchAddresses();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Address updated successfully',
      });
      setEditingAddress(null);
      resetAddressForm();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update address',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    setLoading(true);
    try {
      await api.delete(`/api/auth/addresses/${id}/`);
      await fetchAddresses();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Address deleted successfully',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete address',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditAddress = (address: Address) => {
    setAddressForm({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      address_type: address.address_type,
      is_default: address.is_default,
    });
    setEditingAddress(address.id);
  };

  const resetAddressForm = () => {
    setAddressForm({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'South Africa',
      address_type: 'shipping',
      is_default: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="font-bold mb-6">
        My Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>First Name</Label>
                  {editingProfile ? (
                    <Input
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                    />
                  ) : (
                    <Typography>{user?.first_name || 'Not set'}</Typography>
                  )}
                </div>

                <div>
                  <Label>Last Name</Label>
                  {editingProfile ? (
                    <Input
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                    />
                  ) : (
                    <Typography>{user?.last_name || 'Not set'}</Typography>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  {editingProfile ? (
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  ) : (
                    <Typography>{user?.email}</Typography>
                  )}
                </div>

                <div>
                  <Label>Phone</Label>
                  {editingProfile ? (
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  ) : (
                    <Typography>{user?.phone || 'Not set'}</Typography>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {editingProfile ? (
                    <>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditingProfile(true)} className="flex items-center gap-2">
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Addresses */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Addresses
                </CardTitle>
                {!addingAddress && (
                  <Button size="sm" onClick={() => setAddingAddress(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Address
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add Address Form */}
                {addingAddress && (
                  <Paper className="p-4 bg-[#F5F4ED] dark:bg-[#3A3621] border border-[#C2B280] dark:border-[#4B5320]">
                    <Typography variant="subtitle1" className="font-semibold mb-3">
                      New Address
                    </Typography>
                    <div className="space-y-3">
                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={addressForm.full_name}
                          onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Address Line 1</Label>
                        <Input
                          value={addressForm.address_line1}
                          onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Address Line 2 (Optional)</Label>
                        <Input
                          value={addressForm.address_line2}
                          onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                        />
                      </div>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Label>City</Label>
                          <Input
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Label>State/Province</Label>
                          <Input
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Label>Postal Code</Label>
                          <Input
                            value={addressForm.postal_code}
                            onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Label>Country</Label>
                          <Input
                            value={addressForm.country}
                            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          />
                        </Grid>
                      </Grid>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_default"
                          checked={addressForm.is_default}
                          onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="is_default">Set as default address</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddAddress} disabled={loading}>
                          <Save className="h-4 w-4 mr-1" />
                          Save Address
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAddingAddress(false);
                            resetAddressForm();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Paper>
                )}

                {/* Address List */}
                {addresses.map((address) => (
                  <Paper
                    key={address.id}
                    className="p-4 border border-[#C2B280] dark:border-[#4B5320]"
                  >
                    {editingAddress === address.id ? (
                      <div className="space-y-3">
                        <Typography variant="subtitle1" className="font-semibold mb-3">
                          Edit Address
                        </Typography>
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={addressForm.full_name}
                            onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Address Line 1</Label>
                          <Input
                            value={addressForm.address_line1}
                            onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Address Line 2 (Optional)</Label>
                          <Input
                            value={addressForm.address_line2}
                            onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                          />
                        </div>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Label>City</Label>
                            <Input
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Label>State/Province</Label>
                            <Input
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Label>Postal Code</Label>
                            <Input
                              value={addressForm.postal_code}
                              onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Label>Country</Label>
                            <Input
                              value={addressForm.country}
                              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                            />
                          </Grid>
                        </Grid>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`is_default_${address.id}`}
                            checked={addressForm.is_default}
                            onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`is_default_${address.id}`}>Set as default address</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateAddress(address.id)} disabled={loading}>
                            <Save className="h-4 w-4 mr-1" />
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingAddress(null);
                              resetAddressForm();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <Typography variant="subtitle1" className="font-semibold">
                            {address.full_name}
                          </Typography>
                          {address.is_default && (
                            <Badge className="bg-[#6B8E23]">Default</Badge>
                          )}
                        </div>
                        <Typography variant="body2" className="text-muted-foreground">
                          {address.phone}
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground">
                          {address.address_line1}
                        </Typography>
                        {address.address_line2 && (
                          <Typography variant="body2" className="text-muted-foreground">
                            {address.address_line2}
                          </Typography>
                        )}
                        <Typography variant="body2" className="text-muted-foreground">
                          {address.city}, {address.state} {address.postal_code}
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground">
                          {address.country}
                        </Typography>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditAddress(address)}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </Paper>
                ))}

                {addresses.length === 0 && !addingAddress && (
                  <Typography variant="body2" className="text-muted-foreground text-center py-4">
                    No addresses saved yet. Add your first address above.
                  </Typography>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Container>
    </div>
  );
}
