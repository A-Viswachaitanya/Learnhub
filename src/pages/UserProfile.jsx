import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/Contexts';
import { Button, Input, Card } from '../components/UI';

const UserProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', bio: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name, bio: user.bio || '', email: user.email });
  }, [user]);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300">
              {user.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p className="text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit Profile'}</Button>
        </div>

        <div className="space-y-4">
          <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={!isEditing} />
          <Input label="Email Address" value={formData.email} onChange={() => {}} disabled={true} /> 
          <Input multiline label="Bio" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} disabled={!isEditing} placeholder="Tell us about yourself..." />
          
          {isEditing && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;