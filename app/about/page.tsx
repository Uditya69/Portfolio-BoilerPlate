"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillCard } from "@/components/SkillCard";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface About {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
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
  siteTitle: string;
  siteDescription: string;
  aboutMe: string;
  email: string;
  socialLinks: {
    platform: string;
    url: string;
    icon?: string;
  }[];
  education: Education[];
  certifications: Certification[];
}

export default function AboutPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [about, setAbout] = useState<About[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsSnapshot, aboutSnapshot, settingsDoc] = await Promise.all([
          getDocs(collection(db, "skills")),
          getDocs(collection(db, "about")),
          getDoc(doc(db, "settings", "general"))
        ]);

        const skillsData = skillsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Skill[];

        const aboutData = aboutSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as About[];

        const settingsData = settingsDoc.exists() ? settingsDoc.data() as Settings : null;

        setSkills(skillsData);
        setAbout(aboutData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const skillCategories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Me</h1>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          Get to know more about my journey, skills, and what drives me as a developer.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {about.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}

          {settings?.education && settings.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.education.map((edu) => (
                  <div key={edu.id} className="space-y-2">
                    <h3 className="font-semibold text-lg">{edu.degree}</h3>
                    <p className="text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                    {edu.description && (
                      <p className="text-sm text-muted-foreground">{edu.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {settings?.certifications && settings.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.certifications.map((cert) => (
                  <div key={cert.id} className="space-y-2">
                    <h3 className="font-semibold text-lg">{cert.name}</h3>
                    <p className="text-muted-foreground">{cert.issuer}</p>
                    <p className="text-sm text-muted-foreground">{cert.date}</p>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View Certificate →
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Skills</h2>
          {skillCategories.map((category) => (
            <SkillCard
              key={category}
              category={category}
              skills={skills.filter((skill) => skill.category === category)}
            />
          ))}

          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Connect With Me</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {settings.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 