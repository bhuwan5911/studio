'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, GraduationCap, BarChart3, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <Card className="text-center hover:shadow-lg transition-shadow duration-300 animate-fade-in-up">
        <CardHeader className="items-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);


export default function Home() {
  return (
    <div className="flex flex-col">
       <div className="relative h-[calc(100vh-10rem)] w-full -mt-4 sm:-mt-6 lg:-mt-8 mb-12">
        <video
          src="https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_25fps.mp4"
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
          data-ai-hint="university students walking"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md animate-fade-in-down">
              Welcome to CampusConnect
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mt-4 max-w-3xl drop-shadow-sm animate-fade-in-up">
              A modern, responsive, and functional solution for student management.
            </p>
        </div>
      </div>

       <div className="space-y-12 my-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What is CampusConnect?</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                   This application is a comprehensive student management system built with Next.js and Tailwind CSS. It demonstrates a complete, feature-rich, and production-ready user interface for handling student data effectively.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <FeatureCard 
                    icon={Users}
                    title="Student Management"
                    description="Easily add, edit, delete, and approve student records with a clean and intuitive interface."
                />
                 <FeatureCard 
                    icon={BarChart3}
                    title="Data Analytics"
                    description="Visualize student data with interactive charts and generate insightful reports on performance."
                />
                 <FeatureCard 
                    icon={GraduationCap}
                    title="Modern UI/UX"
                    description="A fully responsive and aesthetically pleasing design with light/dark modes for a great user experience."
                />
            </div>

             <div className="text-center">
                <Button asChild size="lg">
                    <Link href="/students">
                        Get Started <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
       </div>
    </div>
  );
}
