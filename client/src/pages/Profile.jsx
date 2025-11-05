import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import apiClient from '../api/client';
import ProgressBar from '../components/ProgressBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '../lib/supabase';
import Tooltip from '../components/Tooltip';

export default function Profile() {
  const { user: authUser, checkAuth } = useAuth();
  const [user, setUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/profile');
      setUser(response.data.user);
      setBio(response.data.user.bio || '');
      setUsername(response.data.user.username || '');

      // Get achievements
      const achievementsRes = await apiClient.get('/achievements/earned');
      setAchievements(achievementsRes.data.achievements || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast.error('Please upload a JPG or PNG image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile with new image URL
      await apiClient.put('/profile', { profile_picture_url: publicUrl });
      
      toast.success('Profile picture updated!');
      await fetchProfile();
      await checkAuth();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiClient.put('/profile', { username, bio });
      toast.success('Profile updated!');
      await fetchProfile();
      await checkAuth();
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading || !user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className={cn(
      "min-h-screen",
      "bg-white dark:bg-primary-dark"
    )}>
      <div className="container mx-auto px-4 py-8">
        <h1 className={cn(
          "text-3xl font-sans font-bold mb-6",
          "text-primary dark:text-white"
        )}>
          Profile
        </h1>

        {/* Profile Picture Section */}
        <div className={cn(
          "p-6 rounded-2xl shadow-lg mb-6",
          "bg-gradient-to-br from-primary to-primary-light dark:from-primary-light dark:to-primary",
          "text-white"
        )}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className={cn(
                "w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg",
                "bg-white"
              )}>
                {user.profile_picture_url ? (
                  <img 
                    src={user.profile_picture_url} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary text-white text-4xl font-bold">
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{user.username}</h2>
              <p className="text-white/90 mb-4">{user.email}</p>
              <Tooltip 
                content="Upload a new profile picture (JPG or PNG, max 5MB)"
                position="top"
              >
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  variant="outline"
                  className="bg-white text-primary hover:bg-gray-200 hover:text-primary border-white"
                >
                  {uploadingImage ? 'Uploading...' : 'Change Profile Picture'}
                </Button>
              </Tooltip>
              <p className="text-xs text-white/75 mt-2">
                JPG or PNG, max 5MB
              </p>
            </div>
          </div>
        </div>

        <div className={cn(
          "p-6 rounded-lg border mb-6",
          "bg-white dark:bg-primary",
          "border-primary dark:border-primary-light"
        )}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn(
              "text-xl font-sans font-bold",
              "text-primary dark:text-white"
            )}>
              User Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className={cn(
                  "px-4 py-2 rounded font-medium",
                  "bg-secondary hover:bg-secondary-light",
                  "text-white transition-colors"
                )}
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                Username
              </label>
              {editing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2 rounded border",
                    "border-primary dark:border-primary-light",
                    "focus:outline-none focus:ring-2 focus:ring-secondary",
                    "bg-white dark:bg-primary-dark",
                    "text-primary dark:text-white"
                  )}
                />
              ) : (
                <p className={cn(
                  "text-lg",
                  "text-primary dark:text-white"
                )}>
                  {user.username}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                Email
              </label>
              <p className={cn(
                "text-lg",
                "text-primary dark:text-white"
              )}>
                {user.email}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
                Bio
              </label>
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className={cn(
                    "w-full px-4 py-2 rounded border",
                    "border-primary dark:border-primary-light",
                    "focus:outline-none focus:ring-2 focus:ring-secondary",
                    "bg-white dark:bg-primary-dark",
                    "text-primary dark:text-white"
                  )}
                />
              ) : (
                <p className={cn(
                  "text-lg",
                  "text-primary dark:text-white"
                )}>
                  {user.bio || 'No bio set'}
                </p>
              )}
            </div>

            {editing && (
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className={cn(
                    "px-6 py-2 rounded font-medium",
                    "bg-secondary hover:bg-secondary-light",
                    "text-white transition-colors"
                  )}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setBio(user.bio || '');
                    setUsername(user.username || '');
                  }}
                  className={cn(
                    "px-6 py-2 rounded font-medium border",
                    "border-primary dark:border-primary-light",
                    "text-primary dark:text-white",
                    "hover:bg-gray-100 dark:hover:bg-primary-light"
                  )}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className={cn(
          "p-6 rounded-lg border mb-6",
          "bg-white dark:bg-primary",
          "border-primary dark:border-primary-light"
        )}>
          <h2 className={cn(
            "text-xl font-sans font-bold mb-4",
            "text-primary dark:text-white"
          )}>
            Progress
          </h2>
          <div className="mb-4">
            <ProgressBar
              currentXP={user.total_xp}
              currentLevel={user.current_level}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
              <p className={cn(
                "text-3xl font-bold",
                "text-primary dark:text-white"
              )}>
                {user.current_level}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
              <p className={cn(
                "text-3xl md:text-3xl text-2xl font-bold break-all",
                "text-secondary dark:text-secondary-light"
              )}>
                {user.total_xp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className={cn(
          "p-6 rounded-lg border",
          "bg-white dark:bg-primary",
          "border-primary dark:border-primary-light"
        )}>
          <h2 className={cn(
            "text-xl font-sans font-bold mb-4",
            "text-primary dark:text-white"
          )}>
            Achievements Earned
          </h2>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ua) => (
                <div
                  key={ua.achievements.id}
                  className={cn(
                    "p-4 rounded border",
                    "bg-secondary dark:bg-secondary-dark",
                    "border-secondary-dark dark:border-secondary",
                    "text-white"
                  )}
                >
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="font-bold mb-1">{ua.achievements.name}</h3>
                  <p className="text-sm opacity-90">{ua.achievements.description}</p>
                  <p className="text-xs mt-2 opacity-75">
                    Earned: {new Date(ua.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={cn(
              "text-lg",
              "text-primary dark:text-white"
            )}>
              No achievements earned yet. Complete tasks to earn achievements!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


