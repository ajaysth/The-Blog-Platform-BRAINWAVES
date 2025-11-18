"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Save,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  occupation: string;
  company: string;
  website: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  image: string;
}

interface ProfileEditFormProps {
  profile: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
}

export default function ProfileEditForm({
  profile: initialProfile,
  onSave,
}: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "social" | "privacy">(
    "personal"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "social", label: "Social Links" },
    { id: "privacy", label: "Privacy" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your profile information
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="gap-2"
        >
          <Save size={16} />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Image Card */}
        <Card className="lg:col-span-1 p-6 h-fit animate-in slide-in-from-left-4 delay-100">
          <div className="space-y-4">
            <div className="relative group">
              <div className="w-32 h-32 mx-auto rounded-full bg-accent flex items-center justify-center overflow-hidden">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-muted-foreground" />
                )}
              </div>
              <button className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
              </button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
        </Card>

        {/* Form Card */}
        <Card className="lg:col-span-3 animate-in slide-in-from-right-4 delay-200">
          {/* Tabs */}
          <div className="border-b border-border px-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-4 px-2 border-b-2 font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "personal" && (
              <div
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={16} />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={16} />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phoneNumber}
                      onChange={(e) =>
                        updateField("phoneNumber", e.target.value)
                      }
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <Calendar size={16} />
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) =>
                        updateField("dateOfBirth", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="flex items-center gap-2"
                    >
                      <MapPin size={16} />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="occupation"
                      className="flex items-center gap-2"
                    >
                      <Briefcase size={16} />
                      Occupation
                    </Label>
                    <Input
                      id="occupation"
                      value={profile.occupation}
                      onChange={(e) =>
                        updateField("occupation", e.target.value)
                      }
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="flex items-center gap-2"
                    >
                      <Briefcase size={16} />
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    >
                      <Globe size={16} />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={profile.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="github"
                      className="flex items-center gap-2"
                    >
                      <Github size={16} />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      value={profile.githubUrl}
                      onChange={(e) => updateField("githubUrl", e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center gap-2"
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={profile.linkedinUrl}
                      onChange={(e) =>
                        updateField("linkedinUrl", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="twitter"
                      className="flex items-center gap-2"
                    >
                      <Twitter size={16} />
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={profile.twitterUrl}
                      onChange={(e) =>
                        updateField("twitterUrl", e.target.value)
                      }
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="instagram"
                      className="flex items-center gap-2"
                    >
                      <Instagram size={16} />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={profile.instagramUrl}
                      onChange={(e) =>
                        updateField("instagramUrl", e.target.value)
                      }
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="facebook"
                      className="flex items-center gap-2"
                    >
                      <Facebook size={16} />
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={profile.facebookUrl}
                      onChange={(e) =>
                        updateField("facebookUrl", e.target.value)
                      }
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="youtube"
                      className="flex items-center gap-2"
                    >
                      <Youtube size={16} />
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={profile.youtubeUrl}
                      onChange={(e) =>
                        updateField("youtubeUrl", e.target.value)
                      }
                      placeholder="https://youtube.com/@username"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Show Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Display your email on your public profile
                      </p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Show Phone</h4>
                      <p className="text-sm text-muted-foreground">
                        Display your phone number on your public profile
                      </p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">Private Profile</h4>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible only to logged-in users
                      </p>
                    </div>
                    <input type="checkbox" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}