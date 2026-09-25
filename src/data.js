export const categories=[
 {name:'Tutors',icon:'🎓',accent:'blue',count:128},
 {name:'Designers',icon:'✦',accent:'purple',count:86},
 {name:'Photographers',icon:'◉',accent:'pink',count:64},
 {name:'Cleaners',icon:'✧',accent:'cyan',count:94},
 {name:'Artisans',icon:'◆',accent:'orange',count:71},
 {name:'Professionals',icon:'⌘',accent:'green',count:113}
];

export const seedListings=[
 {id:'svc-001',title:'Professional Logo & Brand Kit',seller:'Pixel Forge Studio',location:'Nairobi',price:4500,unit:'project',rating:4.9,reviews:38,category:'Designers',tag:'Popular',verified:true,description:'A polished visual identity starter pack for growing brands.',delivery:'3–5 days'},
 {id:'svc-002',title:'KCSE / University Mathematics Tutor',seller:'Brian M.',location:'Kasarani',price:800,unit:'hour',rating:4.8,reviews:61,category:'Tutors',tag:'Top Rated',verified:true,description:'One-on-one mathematics support with focused revision sessions.',delivery:'Flexible'},
 {id:'svc-003',title:'Event Photography Package',seller:'Nairobi Lens',location:'Westlands',price:12000,unit:'event',rating:5.0,reviews:27,category:'Photographers',tag:'Verified',verified:true,description:'Coverage for birthdays, launches, graduations and private events.',delivery:'48 hrs'},
 {id:'svc-004',title:'Deep Home Cleaning',seller:'FreshNest Services',location:'Kilimani',price:2500,unit:'visit',rating:4.7,reviews:44,category:'Cleaners',tag:'Fast Response',verified:true,description:'Detailed home cleaning with flexible appointment slots.',delivery:'Same day'},
 {id:'svc-005',title:'Custom Handmade Furniture',seller:'Makers Hub KE',location:'Industrial Area',price:8000,unit:'project',rating:4.9,reviews:19,category:'Artisans',tag:'Made Local',verified:true,description:'Made-to-order furniture designed around your space and style.',delivery:'1–3 weeks'},
 {id:'svc-006',title:'Website Setup for Small Business',seller:'JARK Digital Pro',location:'Nairobi • Remote',price:15000,unit:'project',rating:4.9,reviews:52,category:'Professionals',tag:'Featured',verified:true,description:'Responsive business website setup, domain guidance and launch support.',delivery:'5–10 days'},
 {id:'svc-007',title:'Portrait Photography Session',seller:'Frame & Light KE',location:'Lavington',price:3500,unit:'session',rating:4.8,reviews:31,category:'Photographers',tag:'New',verified:true,description:'Studio-style portraits for profiles, graduation and personal branding.',delivery:'24–72 hrs'},
 {id:'svc-008',title:'Deep Cleaning + Move-out Package',seller:'SparkCare Nairobi',location:'South B',price:5500,unit:'visit',rating:4.8,reviews:22,category:'Cleaners',tag:'Best Value',verified:true,description:'Move-in and move-out cleaning with checklist-based completion.',delivery:'Same day'}
];

export const seedOrders=[
 {id:'JM-10021',listingId:'svc-006',title:'Website Setup for Small Business',provider:'JARK Digital Pro',customer:'Demo Customer',amount:15000,status:'In progress',date:'26 Sep 2026',payment:'M-Pesa',kind:'service'},
 {id:'JM-10018',listingId:'svc-003',title:'Event Photography Package',provider:'Nairobi Lens',customer:'Demo Customer',amount:12000,status:'Completed',date:'18 Sep 2026',payment:'Card',kind:'service'}
];

export const seedMessages=[
 {id:'m1',from:'Nairobi Lens',preview:'Thanks! I can hold the Saturday slot.',time:'10:42',unread:true},
 {id:'m2',from:'JARK Digital Pro',preview:'I sent the first homepage concept.',time:'Yesterday',unread:false},
 {id:'m3',from:'FreshNest Services',preview:'What time works for the cleaning visit?',time:'Thu',unread:false}
];

export const seedReviews=[
 {id:1,listingId:'svc-006',author:'Amina K.',rating:5,text:'Very smooth setup and clear communication.',date:'14 Sep 2026'},
 {id:2,listingId:'svc-002',author:'David O.',rating:5,text:'Great explanations and patient tutoring.',date:'11 Sep 2026'}
];