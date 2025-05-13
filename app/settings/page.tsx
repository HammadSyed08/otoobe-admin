"use client";

import { Upload, Trash2, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

// ShadCN UI imports
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const [uploadTermsPdf, setUploadTermsPdf] = useState<string | null>(null);
  const [uploadPrivacyPdf, setUploadPrivacyPdf] = useState<string | null>(null);
  const [uploadAboutPdf, setUploadAboutPdf] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const termsSnap = await getDoc(doc(db, "appSettings", "terms"));
        const privacySnap = await getDoc(doc(db, "appSettings", "privacy"));
        const aboutSnap = await getDoc(doc(db, "appSettings", "about"));

        if (termsSnap.exists()) setUploadTermsPdf(termsSnap.data().pdfUrl);
        if (privacySnap.exists())
          setUploadPrivacyPdf(privacySnap.data().pdfUrl);
        if (aboutSnap.exists()) setUploadAboutPdf(aboutSnap.data().pdfUrl);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        toast({
          title: "Failed to load existing PDFs from server.",
          variant: "destructive",
        });
      }
    };
    fetchPdfs();
  }, [toast]);

  // Upload handlers
  const handleTermPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const storageRef = ref(storage, `terms/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadTermsPdf(downloadURL);
        toast({
          title: "Terms PDF uploaded successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error uploading terms PDF:", error);
        toast({
          title: "Failed to upload Terms PDF.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Please upload a valid PDF file.",
        variant: "destructive",
      });
    }
  };

  const handlePrivacyPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const storageRef = ref(storage, `privacy/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadPrivacyPdf(downloadURL);
        toast({
          title: "Privacy Policy PDF uploaded successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error uploading privacy PDF:", error);
        toast({
          title: "Failed to upload Privacy Policy PDF.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Please upload a valid PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleAboutPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const storageRef = ref(storage, `about/${file.name}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadAboutPdf(downloadURL);
        toast({
          title: "About Us PDF uploaded successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error uploading about PDF:", error);
        toast({
          title: "Failed to upload About Us PDF.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Please upload a valid PDF file.",
        variant: "destructive",
      });
    }
  };

  // Remove handlers
  const removeTermPdf = () => {
    if (uploadTermsPdf) {
      setUploadTermsPdf(null);
      toast({
        title: "Terms and Conditions PDF removed!",
        variant: "default",
      });
    } else {
      toast({
        title: "No PDF to remove.",
        variant: "destructive",
      });
    }
  };

  const removePrivacyPdf = () => {
    if (uploadPrivacyPdf) {
      setUploadPrivacyPdf(null);
      toast({
        title: "Privacy Policy PDF removed!",
        variant: "default",
      });
    } else {
      toast({
        title: "No PDF to remove.",
        variant: "destructive",
      });
    }
  };

  const removeAboutPdf = () => {
    if (uploadAboutPdf) {
      setUploadAboutPdf(null);
      toast({
        title: "About Us PDF removed!",
        variant: "default",
      });
    } else {
      toast({
        title: "No PDF to remove.",
        variant: "destructive",
      });
    }
  };

  // Save handler
  const handleSave = async (page: string) => {
    let urlToSave = null;
    if (page === "terms") urlToSave = uploadTermsPdf;
    else if (page === "privacy") urlToSave = uploadPrivacyPdf;
    else if (page === "about") urlToSave = uploadAboutPdf;

    if (!urlToSave) {
      toast({
        title: "Please upload a PDF before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      await setDoc(doc(db, "appSettings", page), {
        pdfUrl: urlToSave,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: `${
          page.charAt(0).toUpperCase() + page.slice(1)
        } saved successfully!`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving PDF URL to Firestore:", error);
      toast({
        title: "Failed to save. Try again.",
        variant: "destructive",
      });
    }
  };

  // Tab content generator
  const renderTabContent = (
    label: string,
    pdfUrl: string | null,
    handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleRemove: () => void,
    handleSaveClick: () => void,
    inputId: string
  ) => (
    <Card className=" ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#00507F]">
          {label}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex flex-col gap-4">
          {pdfUrl ? (
            <div className="w-full mt-2">
              <iframe
                src={pdfUrl}
                className="w-full h-[50vh] rounded-lg border"
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 p-10 m-20">
              <Label className="text-sm text-muted-foreground p-10 my-10">
                No PDF uploaded yet. Please upload a PDF to view it.
              </Label>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button asChild variant="outline" className="w-fit gap-2">
          <label htmlFor={inputId} className="cursor-pointer flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Choose PDF
          </label>
        </Button>
        <input
          type="file"
          id={inputId}
          accept="application/pdf"
          className="hidden"
          onChange={handleUpload}
        />
        <Button variant="default" className="gap-2" onClick={handleSaveClick}>
          <Save className="w-4 h-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="">
        <h2 className="text-3xl font-bold text-[#00507F] mb-2">App Settings</h2>
        <p className="text-base text-muted-foreground mb-8">
          Update the Terms & Conditions, Privacy Policy, and About Us sections
          for the app.
        </p>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full flex justify-between ">
            <TabsTrigger value="terms" className="flex-1">
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex-1">
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="about" className="flex-1">
              About Us
            </TabsTrigger>
          </TabsList>
          <TabsContent value="terms">
            {renderTabContent(
              "Terms and Conditions",
              uploadTermsPdf,
              handleTermPdf,
              removeTermPdf,
              () => handleSave("terms"),
              "upload-terms"
            )}
          </TabsContent>
          <TabsContent value="privacy">
            {renderTabContent(
              "Privacy Policy",
              uploadPrivacyPdf,
              handlePrivacyPdf,
              removePrivacyPdf,
              () => handleSave("privacy"),
              "upload-privacy"
            )}
          </TabsContent>
          <TabsContent value="about">
            {renderTabContent(
              "About Us",
              uploadAboutPdf,
              handleAboutPdf,
              removeAboutPdf,
              () => handleSave("about"),
              "upload-about"
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
