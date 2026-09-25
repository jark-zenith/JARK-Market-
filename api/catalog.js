const catalog=[
 {id:'svc-001',title:'Professional Logo & Brand Kit',category:'Designers',location:'Nairobi',price:4500},
 {id:'svc-002',title:'KCSE / University Mathematics Tutor',category:'Tutors',location:'Kasarani',price:800},
 {id:'svc-003',title:'Event Photography Package',category:'Photographers',location:'Westlands',price:12000},
 {id:'svc-004',title:'Deep Home Cleaning',category:'Cleaners',location:'Kilimani',price:2500}
];
export default function handler(req,res){res.status(200).json({items:catalog,count:catalog.length,source:'demo-api'})}
