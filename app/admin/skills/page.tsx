"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: 5,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "skills"));
      const skillsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
      setSkills(skillsData);
    } catch (err) {
      console.error("Error fetching skills:", err);
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingSkill) {
        await updateDoc(doc(db, "skills", editingSkill.id), formData);
        toast.success("Skill updated successfully");
      } else {
        await addDoc(collection(db, "skills"), formData);
        toast.success("Skill added successfully");
      }

      setFormData({
        name: "",
        category: "",
        level: 5,
      });
      setEditingSkill(null);
      fetchSkills();
    } catch (err) {
      console.error("Error adding skill:", err);
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteDoc(doc(db, "skills", id));
        toast.success("Skill deleted successfully");
        fetchSkills();
      } catch (err) {
        console.error("Error deleting skill:", err);
        toast.error("Failed to delete skill");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Skills</h1>
        <Button
          onClick={() => {
            setEditingSkill(null);
            setFormData({
              name: "",
              category: "",
              level: 5,
            });
          }}
        >
          Add New Skill
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingSkill ? "Edit Skill" : "Add New Skill"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Skill Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                list="categories"
              />
              <datalist id="categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label htmlFor="level">Proficiency Level (1-10)</label>
              <Input
                id="level"
                name="level"
                type="number"
                min="1"
                max="10"
                value={formData.level}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Saving..."
                : editingSkill
                ? "Update Skill"
                : "Add Skill"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Level: {skill.level}/10
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(skill)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(skill.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 