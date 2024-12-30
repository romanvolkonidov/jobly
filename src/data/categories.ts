export interface CategoryWithSubcategories {
  name: string;
  subcategories: string[];
}

export const categories: CategoryWithSubcategories[] = [
  {
    name: 'Courier Services',
    subcategories: [
      'Pedestrian Courier Services',
      'Courier Services by Car',
      'Buy and Deliver',
      'Urgent Delivery',
      'Grocery Delivery',
      'Food Delivery from Restaurants',
      'Courier for a Day',
      'Other Parcel',
    ],
  },
  {
    name: 'Repair and Construction',
    subcategories: [
      'Apartment Renovation',
      'Home Repairs',
      'Furniture Assembly',
      'Plumbing',
      'Electrical Work',
      'Door Installation',
      'Wallpapering',
      'Painting Work',
    ],
  },
  {
    name: 'Freight Transportation',
    subcategories: [
      'Moving Services',
      'Cargo Transportation',
      'Furniture Delivery',
      'Construction Materials',
      'Equipment Transportation',
    ],
  },
  {
    name: 'Cleaning and Household Help',
    subcategories: [
      'House Cleaning',
      'Office Cleaning',
      'Window Cleaning',
      'After Repair Cleaning',
      'Carpet Cleaning',
      'Yard Clean Up',
    ],
  },
  {
    name: 'Virtual Assistant',
    subcategories: [
      'Data Entry',
      'Research',
      'Email Management',
      'Calendar Management',
      'Social Media Management',
      'Customer Support',
      'Content Writing',
    ],
  },
  {
    name: 'Computer Assistance',
    subcategories: [
      'PC Setup and Configuration',
      'Software Installation',
      'Hardware Repair',
      'Network Setup',
      'Data Recovery',
      'Virus Removal',
      'Computer Training',
    ],
  },
  {
    name: 'Events and Promotions',
    subcategories: [
      'Event Planning',
      'Photography',
      'Videography',
      'DJ Services',
      'Catering',
      'Promotional Staff',
      'Event Setup',
    ],
  },
  {
    name: 'Design',
    subcategories: [
      'Graphic Design',
      'Web Design',
      'Logo Design',
      'UI/UX Design',
      'Interior Design',
      'Product Design',
      'Print Design',
    ],
  },
  {
    name: 'Software Development',
    subcategories: [
      'Web Development',
      'Mobile App Development',
      'Desktop Applications',
      'API Development',
      'QA Testing',
      'Database Development',
      'DevOps Services',
    ],
  },
  {
    name: 'Photo, Video, and Audio',
    subcategories: [
      'Photo Editing',
      'Video Editing',
      'Audio Production',
      'Voice Over',
      'Animation',
      'Music Production',
      'Podcast Production',
    ],
  },
  {
    name: 'Installation and Repair of Equipment',
    subcategories: [
      'Home Appliance Repair',
      'HVAC Installation',
      'Security System Installation',
      'TV Mounting',
      'Smart Home Setup',
      'Exercise Equipment Assembly',
    ],
  },
  {
    name: 'Beauty and Health',
    subcategories: [
      'Haircuts and Styling',
      'Makeup Services',
      'Massage',
      'Nail Care',
      'Personal Training',
      'Nutrition Consulting',
      'Spa Services',
    ],
  },
  {
    name: 'Digital Equipment Repair',
    subcategories: [
      'Smartphone Repair',
      'Tablet Repair',
      'Laptop Repair',
      'Game Console Repair',
      'Printer Repair',
      'Screen Replacement',
    ],
  },
  {
    name: 'Legal and Accounting Assistance',
    subcategories: [
      'Legal Document Review',
      'Tax Preparation',
      'Bookkeeping',
      'Contract Review',
      'Business Registration',
      'Notary Services',
    ],
  },
  {
    name: 'Tutors and Education',
    subcategories: [
      'Math Tutoring',
      'Language Learning',
      'Science Tutoring',
      'Test Preparation',
      'Music Lessons',
      'Computer Skills',
      'Academic Writing',
    ],
  },
  {
    name: 'Vehicle Repair',
    subcategories: [
      'Car Repair',
      'Oil Change',
      'Tire Services',
      'Motorcycle Repair',
      'Car Detailing',
      'Battery Replacement',
      'Diagnostic Services',
    ],
  },
];
