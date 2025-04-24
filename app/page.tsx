"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Settings {
  fullName: string;
  title: string;
  bio: string;
  profileImage?: string;
  socialLinks?: {
    platform: string;
    url: string;
    icon?: string;
  }[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsDoc, projectsSnapshot, skillsSnapshot] = await Promise.all([
          getDoc(doc(db, "settings", "general")),
          getDocs(collection(db, "projects")),
          getDocs(collection(db, "skills"))
        ]);

        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as Settings);
        }

        const projectsData = projectsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Project))
          .slice(0, 3); // Get only 3 featured projects
        setFeaturedProjects(projectsData);

        const skillsData = skillsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Skill))
          .sort((a, b) => b.level - a.level)
          .slice(0, 6); // Get top 6 skills
        setSkills(skillsData);
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
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {settings?.profileImage && (
            <div className="relative w-32 h-32 mb-8 rounded-full overflow-hidden mx-auto">
              <Image
                src={settings.profileImage}
                alt={settings.fullName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Hi, I'm {settings?.fullName || "Developer"}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-[600px] mx-auto">
            {settings?.title || "A passionate developer"}
          </p>
          <p className="mt-2 text-muted-foreground max-w-[600px] mx-auto">
            {settings?.bio || "Building amazing web experiences"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-4"
        >
          <Link href="/projects">
            <Button size="lg">View My Work</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Me
            </Button>
          </Link>
        </motion.div>

        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 mt-4"
          >
            {settings.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.platform}
              </a>
            ))}
          </motion.div>
        )}
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Here are some of my recent works that showcase my skills and expertise.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  {project.imageUrl && (
                    <div className="aspect-video relative">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Live Demo →
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          GitHub →
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold">Skills & Expertise</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Here are some of the technologies and tools I work with.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.category}</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8"
      >
        <h2 className="text-3xl font-bold">Let's Work Together</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto">
          I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>
        <Link href="/contact">
          <Button size="lg">Get in Touch</Button>
        </Link>
      </motion.section>
    </div>
  );
}
