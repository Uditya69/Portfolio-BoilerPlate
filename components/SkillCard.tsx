"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface SkillCardProps {
  category: string;
  skills: Skill[];
}

export function SkillCard({ category, skills }: SkillCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">
                {skill.level}/10
              </span>
            </div>
            <Progress
              value={skill.level * 10}
              className={cn(
                "h-2",
                skill.level >= 8 && "bg-green-500",
                skill.level >= 6 && skill.level < 8 && "bg-blue-500",
                skill.level >= 4 && skill.level < 6 && "bg-yellow-500",
                skill.level < 4 && "bg-red-500"
              )}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 