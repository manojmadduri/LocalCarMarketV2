import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Wrench, 
  Users, 
  Calculator, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  DollarSign,
  GraduationCap,
  Briefcase,
  TrendingUp
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract";
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  icon: any;
}

const jobPostings: JobPosting[] = [
  {
    id: "sales-consultant",
    title: "Sales Consultant",
    department: "Sales",
    type: "Full-time",
    experience: "1-3 years",
    salary: "$45,000 - $80,000 + Commission",
    description: "Join our dynamic sales team and help customers find their perfect vehicle. We're looking for motivated individuals with excellent communication skills and a passion for automotive sales.",
    requirements: [
      "High school diploma or equivalent",
      "Valid driver's license with clean driving record",
      "Previous sales experience preferred",
      "Strong communication and interpersonal skills",
      "Customer service oriented mindset",
      "Ability to work weekends and evenings"
    ],
    responsibilities: [
      "Greet and assist customers on the sales floor",
      "Conduct vehicle demonstrations and test drives",
      "Negotiate pricing and financing options",
      "Maintain customer database and follow up on leads",
      "Achieve monthly sales targets",
      "Provide exceptional customer service throughout the sales process"
    ],
    benefits: [
      "Competitive base salary plus commission",
      "Health insurance coverage",
      "401(k) retirement plan",
      "Paid vacation and sick leave",
      "Employee vehicle discounts",
      "Ongoing sales training programs"
    ],
    icon: Users
  },
  {
    id: "automotive-technician",
    title: "Automotive Technician",
    department: "Service",
    type: "Full-time",
    experience: "2-5 years",
    salary: "$50,000 - $75,000",
    description: "We're seeking skilled automotive technicians to join our service department. The ideal candidate will have ASE certification and experience with various vehicle makes and models.",
    requirements: [
      "ASE certification preferred",
      "2+ years of automotive repair experience",
      "Proficiency with diagnostic equipment",
      "Knowledge of electrical, engine, and transmission systems",
      "Own basic hand tools",
      "Valid driver's license"
    ],
    responsibilities: [
      "Perform routine maintenance and complex repairs",
      "Diagnose vehicle problems using computerized equipment",
      "Complete work orders accurately and efficiently",
      "Maintain clean and organized work area",
      "Communicate with service advisors about repair needs",
      "Stay updated on new automotive technologies"
    ],
    benefits: [
      "Competitive hourly wage",
      "Health and dental insurance",
      "Tool allowance program",
      "Continuing education opportunities",
      "Performance bonuses",
      "Uniform allowance"
    ],
    icon: Wrench
  },
  {
    id: "service-advisor",
    title: "Service Advisor",
    department: "Service",
    type: "Full-time",
    experience: "1-3 years",
    salary: "$40,000 - $60,000",
    description: "Act as the primary point of contact between customers and our service department. Help customers understand their vehicle's needs and recommend appropriate services.",
    requirements: [
      "High school diploma or equivalent",
      "Previous customer service experience",
      "Basic automotive knowledge preferred",
      "Strong communication skills",
      "Computer proficiency",
      "Ability to work in fast-paced environment"
    ],
    responsibilities: [
      "Greet customers and document service requests",
      "Provide accurate service estimates",
      "Schedule appointments and manage workflow",
      "Communicate repair status to customers",
      "Handle customer concerns and complaints",
      "Process service orders and payments"
    ],
    benefits: [
      "Base salary plus performance incentives",
      "Health insurance benefits",
      "Paid time off",
      "Employee discounts",
      "Training and development programs",
      "Career advancement opportunities"
    ],
    icon: Phone
  },
  {
    id: "finance-manager",
    title: "Finance Manager",
    department: "Finance",
    type: "Full-time",
    experience: "3-5 years",
    salary: "$60,000 - $90,000 + Bonuses",
    description: "Manage the finance and insurance aspects of vehicle sales. Work with customers to secure financing and present additional protection products.",
    requirements: [
      "Bachelor's degree in Finance or related field preferred",
      "3+ years of automotive finance experience",
      "Knowledge of lending regulations and procedures",
      "Strong analytical and negotiation skills",
      "Professional appearance and demeanor",
      "Ability to work under pressure"
    ],
    responsibilities: [
      "Structure financing deals for customers",
      "Present extended warranties and insurance products",
      "Maintain relationships with lending institutions",
      "Ensure compliance with federal and state regulations",
      "Prepare and review finance contracts",
      "Achieve finance and insurance penetration goals"
    ],
    benefits: [
      "Competitive salary plus bonus structure",
      "Comprehensive health benefits",
      "401(k) with company match",
      "Professional development opportunities",
      "Performance-based incentives",
      "Executive benefits package"
    ],
    icon: Calculator
  },
  {
    id: "parts-specialist",
    title: "Parts Specialist",
    department: "Parts",
    type: "Full-time",
    experience: "1-2 years",
    salary: "$35,000 - $50,000",
    description: "Manage inventory and assist customers and technicians with parts identification and ordering. Maintain accurate records and ensure parts availability.",
    requirements: [
      "High school diploma or equivalent",
      "Previous parts or inventory experience preferred",
      "Basic automotive knowledge",
      "Computer skills and attention to detail",
      "Ability to lift up to 50 pounds",
      "Forklift certification a plus"
    ],
    responsibilities: [
      "Identify and order parts for repairs",
      "Maintain inventory levels and organization",
      "Assist customers with parts purchases",
      "Process returns and warranty claims",
      "Coordinate with service department on parts needs",
      "Update parts pricing and availability"
    ],
    benefits: [
      "Competitive hourly wage",
      "Health insurance options",
      "Employee parts discounts",
      "Paid holidays and vacation",
      "On-the-job training",
      "Stable work schedule"
    ],
    icon: Car
  },
  {
    id: "detailing-specialist",
    title: "Detailing Specialist",
    department: "Reconditioning",
    type: "Full-time",
    experience: "Entry Level",
    salary: "$30,000 - $40,000",
    description: "Prepare vehicles for sale through comprehensive cleaning, detailing, and reconditioning services. Maintain high standards for vehicle presentation.",
    requirements: [
      "High school diploma or equivalent",
      "Attention to detail and quality",
      "Physical ability to work outdoors",
      "Reliable and punctual",
      "Previous detailing experience preferred but not required",
      "Valid driver's license"
    ],
    responsibilities: [
      "Wash, wax, and detail vehicles inside and out",
      "Apply protective coatings and treatments",
      "Inspect vehicles for damage or needed repairs",
      "Maintain detailing equipment and supplies",
      "Follow safety protocols and procedures",
      "Ensure vehicles meet presentation standards"
    ],
    benefits: [
      "Competitive starting wage",
      "Health insurance after 90 days",
      "Paid training program",
      "Advancement opportunities",
      "Employee vehicle discounts",
      "Flexible scheduling options"
    ],
    icon: Car
  }
];

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Compensation",
    description: "We offer competitive salaries, commission structures, and performance bonuses."
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    description: "Ongoing training programs to help you grow your skills and advance your career."
  },
  {
    icon: Briefcase,
    title: "Career Growth",
    description: "Clear advancement paths and promotion opportunities within our organization."
  },
  {
    icon: TrendingUp,
    title: "Performance Rewards",
    description: "Recognition programs and incentives for top performers and team achievements."
  }
];

export default function Careers() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-clean">
      {/* Hero Section */}
      <div className="contact-hero py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl mb-6 text-high-contrast">
            Join Our Team
          </h1>
          <p className="text-lead text-muted-foreground max-w-3xl mx-auto">
            Build your career with The Integrity Auto and Body. We're always looking for talented, motivated individuals to join our growing team and help us provide exceptional service to our customers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Why Work With Us Section */}
        <div className="mb-16">
          <h2 className="section-title text-center mb-12 text-high-contrast">
            Why Choose a Career With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="contact-card text-center">
                <div className="flex justify-center mb-4">
                  <benefit.icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="card-title text-high-contrast mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Openings Section */}
        <div className="mb-16">
          <h2 className="section-title text-center mb-12 text-high-contrast">
            Current Job Openings
          </h2>
          <div className="space-y-8">
            {jobPostings.map((job) => (
              <div key={job.id} className="contact-card">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Job Header */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <job.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="card-title text-high-contrast">{job.title}</h3>
                        <p className="text-muted-foreground">{job.department} Department</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="badge-success">{job.type}</Badge>
                      <Badge variant="outline">{job.experience}</Badge>
                      <Badge variant="outline">{job.salary}</Badge>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 space-y-6">
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Requirements */}
                      <div>
                        <h4 className="font-semibold text-high-contrast mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <h4 className="font-semibold text-high-contrast mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.slice(0, 4).map((resp, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {resp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold text-high-contrast mb-3">Benefits</h4>
                        <ul className="space-y-2">
                          {job.benefits.slice(0, 4).map((benefit, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start">
                              <span className="text-primary mr-2">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="pt-4">
                      <Button 
                        className="btn-primary"
                        onClick={() => {
                          const subject = `Application for ${job.title} Position`;
                          const body = `Dear Hiring Manager,\n\nI am interested in applying for the ${job.title} position in your ${job.department} department. Please find my resume attached.\n\nBest regards`;
                          window.location.href = `mailto:careers@integrityautobody.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        }}
                      >
                        Apply for This Position
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process Section */}
        <div className="mb-16">
          <h2 className="section-title text-center mb-12 text-high-contrast">
            How to Apply
          </h2>
          <div className="contact-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="card-title text-high-contrast mb-6">Application Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-high-contrast">Submit Your Application</h4>
                      <p className="text-muted-foreground text-sm">Click "Apply for This Position" for any job that interests you, or send your resume directly to our careers email.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-high-contrast">Initial Review</h4>
                      <p className="text-muted-foreground text-sm">Our HR team will review your application and contact qualified candidates within 3-5 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-high-contrast">Interview Process</h4>
                      <p className="text-muted-foreground text-sm">Participate in our interview process, which may include phone screening and in-person interviews.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-high-contrast">Welcome to the Team</h4>
                      <p className="text-muted-foreground text-sm">Complete background checks and paperwork, then begin your comprehensive onboarding program.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="card-title text-high-contrast mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="contact-info-item">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-high-contrast">Email</h4>
                      <p className="text-muted-foreground">careers@integrityautobody.com</p>
                      <p className="text-sm text-muted-foreground">Send your resume and cover letter</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-high-contrast">Phone</h4>
                      <p className="text-muted-foreground">(555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Call for general career inquiries</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-high-contrast">Location</h4>
                      <p className="text-muted-foreground">123 Auto Center Drive</p>
                      <p className="text-muted-foreground">Austin, TX 78701</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-high-contrast">HR Hours</h4>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p className="text-sm text-muted-foreground">Best time to call about applications</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equal Opportunity Statement */}
        <div className="contact-card text-center">
          <h3 className="card-title text-high-contrast mb-4">Equal Opportunity Employer</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            The Integrity Auto and Body is an equal opportunity employer committed to creating an inclusive environment for all employees. We celebrate diversity and are committed to creating an inclusive environment for all employees regardless of race, color, religion, sex, national origin, age, disability, or veteran status.
          </p>
        </div>
      </div>
    </div>
  );
}