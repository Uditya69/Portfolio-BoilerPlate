"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

interface Settings {
  // Personal Information
  fullName: string;
  title: string;
  bio: string;
  email: string;
  location?: string;
  profileImage?: string;

  // SEO
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  ogImage?: string;
  twitterHandle?: string;
  customDomain?: string;

  // Content
  aboutMe: string;
  socialLinks: SocialLink[];
  education: Education[];
  certifications: Certification[];
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    fullName: "",
    title: "",
    bio: "",
    email: "",
    location: "",
    profileImage: "",
    siteTitle: "",
    siteDescription: "",
    keywords: [],
    ogImage: "",
    twitterHandle: "",
    customDomain: "",
    aboutMe: "",
    socialLinks: [],
    education: [],
    certifications: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "general");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      } else {
        // Create initial settings document if it doesn't exist
        await setDoc(docRef, {
          fullName: "",
          title: "",
          bio: "",
          email: "",
          location: "",
          profileImage: "",
          siteTitle: "",
          siteDescription: "",
          keywords: [],
          ogImage: "",
          twitterHandle: "",
          customDomain: "",
          aboutMe: "",
          socialLinks: [],
          education: [],
          certifications: [],
        });
        setSettings({
          fullName: "",
          title: "",
          bio: "",
          email: "",
          location: "",
          profileImage: "",
          siteTitle: "",
          siteDescription: "",
          keywords: [],
          ogImage: "",
          twitterHandle: "",
          customDomain: "",
          aboutMe: "",
          socialLinks: [],
          education: [],
          certifications: [],
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = doc(db, "settings", "general");
      await setDoc(docRef, settings, { merge: true });
      toast.success("Settings updated successfully");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    setSettings((prev) => {
      const newSocialLinks = [...prev.socialLinks];
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      return { ...prev, socialLinks: newSocialLinks };
    });
  };

  const addSocialLink = () => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const removeSocialLink = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setSettings((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [field]: value };
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setSettings((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), degree: "", institution: "", year: "", description: "" },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    setSettings((prev) => {
      const newCertifications = [...prev.certifications];
      newCertifications[index] = { ...newCertifications[index], [field]: value };
      return { ...prev, certifications: newCertifications };
    });
  };

  const addCertification = () => {
    setSettings((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: Date.now().toString(), name: "", issuer: "", date: "", url: "" },
      ],
    }));
  };

  const removeCertification = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName">Full Name</label>
              <Input
                id="fullName"
                name="fullName"
                value={settings.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="title">Professional Title</label>
              <Input
                id="title"
                name="title"
                value={settings.title}
                onChange={handleChange}
                required
                placeholder="e.g., Full Stack Developer"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bio">Short Bio</label>
              <Textarea
                id="bio"
                name="bio"
                value={settings.bio}
                onChange={handleChange}
                required
                placeholder="A brief introduction about yourself"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={settings.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location">Location</label>
              <Input
                id="location"
                name="location"
                value={settings.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="profileImage">Profile Image URL</label>
              <Input
                id="profileImage"
                name="profileImage"
                value={settings.profileImage}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="siteTitle">Site Title</label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                required
                placeholder="e.g., John Doe - Portfolio"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="siteDescription">Site Description</label>
              <Input
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                required
                placeholder="A brief description of your portfolio"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="keywords">Keywords (comma-separated)</label>
              <Input
                id="keywords"
                name="keywords"
                value={settings.keywords.join(", ")}
                onChange={(e) => {
                  const keywords = e.target.value.split(",").map(k => k.trim());
                  setSettings(prev => ({ ...prev, keywords }));
                }}
                placeholder="e.g., web development, react, node.js"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ogImage">Open Graph Image URL</label>
              <Input
                id="ogImage"
                name="ogImage"
                value={settings.ogImage}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="twitterHandle">Twitter Handle</label>
              <Input
                id="twitterHandle"
                name="twitterHandle"
                value={settings.twitterHandle}
                onChange={handleChange}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="customDomain">Custom Domain</label>
              <Input
                id="customDomain"
                name="customDomain"
                value={settings.customDomain}
                onChange={handleChange}
                placeholder="e.g., johndoe.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Social Links</CardTitle>
              <Button type="button" onClick={addSocialLink} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Social Link
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.socialLinks.map((link, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <label>Platform</label>
                  <Input
                    value={link.platform}
                    onChange={(e) => handleSocialLinkChange(index, "platform", e.target.value)}
                    placeholder="e.g., GitHub, LinkedIn, Twitter"
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label>URL</label>
                  <Input
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, "url", e.target.value)}
                    placeholder="https://..."
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-8"
                  onClick={() => removeSocialLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Education</CardTitle>
              <Button type="button" onClick={addEducation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.education.map((edu) => (
              <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label>Degree</label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(settings.education.findIndex((ed) => ed.id === edu.id), "degree", e.target.value)}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Institution</label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(settings.education.findIndex((ed) => ed.id === edu.id), "institution", e.target.value)}
                        placeholder="e.g., University of Example"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Year</label>
                      <Input
                        value={edu.year}
                        onChange={(e) => handleEducationChange(settings.education.findIndex((ed) => ed.id === edu.id), "year", e.target.value)}
                        placeholder="e.g., 2018-2022"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Description</label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => handleEducationChange(settings.education.findIndex((ed) => ed.id === edu.id), "description", e.target.value)}
                        placeholder="Brief description of your education"
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Certifications</CardTitle>
              <Button type="button" onClick={addCertification} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.certifications.map((cert) => (
              <div key={cert.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label>Certification Name</label>
                      <Input
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(settings.certifications.findIndex((c) => c.id === cert.id), "name", e.target.value)}
                        placeholder="e.g., AWS Certified Solutions Architect"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Issuer</label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => handleCertificationChange(settings.certifications.findIndex((c) => c.id === cert.id), "issuer", e.target.value)}
                        placeholder="e.g., Amazon Web Services"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Date</label>
                      <Input
                        value={cert.date}
                        onChange={(e) => handleCertificationChange(settings.certifications.findIndex((c) => c.id === cert.id), "date", e.target.value)}
                        placeholder="e.g., January 2023"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label>Certificate URL (optional)</label>
                      <Input
                        value={cert.url}
                        onChange={(e) => handleCertificationChange(settings.certifications.findIndex((c) => c.id === cert.id), "url", e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeCertification(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
} 