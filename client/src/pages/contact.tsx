import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Mail, Clock, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormData } from "@shared/schema";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Items are delivered within 5-30 minutes after payment confirmation. We'll add you on Roblox and trade the items directly to your account.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Vodafone Cash and InstaPay for all Egyptian customers. These are the most convenient and secure payment methods available.",
  },
  {
    question: "Is it safe to buy MM2 items?",
    answer:
      "Yes! We've been trading MM2 items for years with 100% customer satisfaction. All transactions are secure and we never ask for your Roblox password.",
  },
  {
    question: "What if I don't receive my items?",
    answer:
      "Contact us immediately via this form or through our social media. We have a 100% delivery guarantee - if there's any issue, we'll resolve it immediately.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Due to the nature of digital items, refunds are not possible once items are delivered. However, if there's an issue with your order, we'll work to make it right.",
  },
  {
    question: "Do you offer bulk discounts?",
    answer:
      "Yes! For large orders, contact us directly to discuss special pricing. We offer discounts on bulk purchases and bundles.",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      robloxUsername: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 2 hours.",
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-heading text-3xl font-bold uppercase tracking-wider md:text-4xl">
            Contact Us
          </h1>
          <p className="text-muted-foreground">
            Have questions? We're here to help!
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your name"
                              {...field}
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              data-testid="input-contact-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="robloxUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roblox Username (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Roblox username"
                              {...field}
                              data-testid="input-contact-roblox"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we help you?"
                              className="min-h-32 resize-none"
                              {...field}
                              data-testid="textarea-contact-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                      data-testid="button-send-message"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Response Time</h4>
                    <p className="text-sm text-muted-foreground">Within 2 hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">24/7 Support</h4>
                    <p className="text-sm text-muted-foreground">Always available</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger
                        className="text-left hover:no-underline"
                        data-testid={`accordion-question-${index}`}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="p-6 text-center">
                <Mail className="mx-auto mb-4 h-10 w-10 text-primary" />
                <h4 className="mb-2 font-heading text-lg font-semibold">
                  Still have questions?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Don't hesitate to reach out. We're always happy to help with any
                  questions about our MM2 items or the purchasing process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
