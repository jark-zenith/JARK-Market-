import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Search,ShoppingBag,MapPin,Star,ArrowRight,ShieldCheck,Menu,X,ChevronRight,Sparkles,Briefcase,Camera,GraduationCap,Wrench,Palette,HeartHandshake} from 'lucide-react';
import './styles.css';

const categories=[
 {name:'Tutors',icon:GraduationCap,color:'blue'},
 {name:'Designers',icon:Palette,color:'purple'},
 {name:'Photographers',icon:Camera,color:'pink'},
 {name:'Cleaners',icon:Sparkles,color:'cyan'},
 {name:'Artisans',icon:Wrench,color:'orange'},
 {name:'Professionals',icon:Briefcase,color:'green'}
];

const listings=[
 {id:1,title:'Professional Logo & Brand Kit',seller:'Pixel Forge Studio',location:'Nairobi',price:'KSh 4,500',rating:4.9,reviews:38,category:'Designers',tag:'Popular',initials:'PF'},
 {id:2,title:'KCSE / University Mathematics Tutor',seller:'Brian M.',location:'Kasarani',price:'KSh 800 / hr',rating:4.8,reviews:61,category:'Tutors',tag:'Top Rated',initials:'BM'},
 {id:3,title:'Event Photography Package',seller:'Nairobi Lens',location:'Westlands',price:'KSh 12,000',rating:5.0,reviews:27,category:'Photographers',tag:'Verified',initials:'NL'},
 {id:4,title:'Deep Home Cleaning',seller:'FreshNest Services',location:'Kilimani',price:'KSh 2,500',rating:4.7,reviews:44,category:'Cleaners',tag:'Fast Response',initials:'FN'},
 {id:5,title:'Custom Handmade Furniture',seller:'Makers Hub KE',location:'Industrial Area',price:'From KSh 8,000',rating:4.9,reviews:19,category:'Artisans',tag:'Made Local',initials:'MH'},
 {id:6,title:'Website Setup for Small Business',seller:'JARK Digital Pro',location:'Nairobi • Remote',price:'From KSh 15,000',rating:4.9,reviews:52,category:'Professionals',tag:'Featured',initials:'JD'}
];

function App(){
 const [query,setQuery]=useState('');
 const [active,setActive]=useState('All');
 const [cart,setCart]=useState(0);
 const [menu,setMenu]=useState(false);
 const filtered=useMemo(()=>listings.filter(x=>(active==='All'||x.category===active)&&(!query||[x.title,x.seller,x.location,x.category].join(' ').toLowerCase().includes(query.toLowerCase()))),[query,active]);
 return <div className="app">
  <header className="nav">
   <div className="nav-inner">
    <button className="brand" onClick={()=>{setActive('All');setQuery('')}}><span className="brand-mark">J</span><span>JARK<span className="brand-accent"> Market</span></span></button>
    <div className="desktop-search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services, products or professionals..."/></div>
    <nav className={menu?'mobile-nav':'desktop-nav'}>
      <button>Explore</button><button>How it works</button><button className="sell-link">Become a seller</button>
    </nav>
    <button className="cart"><ShoppingBag size={20}/><span>Cart</span>{cart>0&&<b>{cart}</b>}</button>
    <button className="menu-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
   </div>
   <div className="mobile-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search JARK Market..."/></div>
  </header>

  <main>
   <section className="hero">
    <div className="hero-glow one"></div><div className="hero-glow two"></div>
    <div className="hero-copy">
      <div className="eyebrow"><Sparkles size={15}/> THE LOCAL MARKETPLACE, REIMAGINED</div>
      <h1>Find people who can <span>get it done.</span></h1>
      <p>Discover trusted tutors, designers, photographers, artisans, cleaners and tech professionals — all in one marketplace.</p>
      <div className="hero-search"><Search size={21}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What do you need help with?"/><button onClick={()=>document.getElementById('listings').scrollIntoView({behavior:'smooth'})}>Search</button></div>
      <div className="hero-meta"><span><ShieldCheck size={16}/> Verified providers</span><span><HeartHandshake size={16}/> Secure marketplace</span><span><MapPin size={16}/> Kenya first</span></div>
    </div>
    <div className="hero-card">
      <div className="orb"></div><div className="floating-card top"><Star fill="currentColor" size={15}/> 4.9 average rating</div>
      <div className="market-preview"><div className="preview-head"><span>JARK</span><span>MARKET</span></div><div className="preview-grid"><i></i><i></i><i></i><i></i></div><div className="preview-line"></div><div className="preview-line short"></div></div>
      <div className="floating-card bottom"><span className="status-dot"></span> 2,400+ local providers</div>
    </div>
   </section>

   <section className="section categories">
    <div className="section-head"><div><p className="kicker">BROWSE</p><h2>Explore categories</h2></div><button className="text-btn">View all <ArrowRight size={17}/></button></div>
    <div className="category-grid">{categories.map(c=>{const Icon=c.icon;return <button key={c.name} className="category" onClick={()=>{setActive(c.name);document.getElementById('listings').scrollIntoView({behavior:'smooth'})}}><span className={'cat-icon '+c.color}><Icon size={22}/></span><strong>{c.name}</strong><ChevronRight size={16}/></button>})}</div>
   </section>

   <section className="section" id="listings">
    <div className="section-head"><div><p className="kicker">DISCOVER</p><h2>{active==='All'?'Popular on JARK Market':active}</h2></div><div className="filters"><button className={active==='All'?'active':''} onClick={()=>setActive('All')}>All</button>{categories.slice(0,4).map(c=><button key={c.name} className={active===c.name?'active':''} onClick={()=>setActive(c.name)}>{c.name}</button>)}</div></div>
    <div className="listing-grid">{filtered.map(item=><article className="listing" key={item.id}><div className="listing-visual"><div className="visual-shape">{item.initials}</div><span className="tag">{item.tag}</span><button className="heart">♡</button></div><div className="listing-body"><div className="provider">{item.category}<span>•</span>{item.seller}</div><h3>{item.title}</h3><div className="location"><MapPin size={14}/>{item.location}</div><div className="listing-bottom"><span className="price">{item.price}</span><span className="rating"><Star fill="currentColor" size={14}/>{item.rating} <em>({item.reviews})</em></span></div><button className="details" onClick={()=>setCart(c=>c+1)}>Add to shortlist <ArrowRight size={15}/></button></div></article>)}</div>
    {filtered.length===0&&<div className="empty"><Search size={30}/><h3>No matches yet</h3><p>Try another search or browse all categories.</p><button onClick={()=>{setQuery('');setActive('All')}}>Clear filters</button></div>}
   </section>

   <section className="seller-banner"><div><p className="kicker">FOR PROFESSIONALS</p><h2>Turn your skills into opportunity.</h2><p>Build a profile, showcase your work and connect with customers looking for exactly what you offer.</p></div><button>Start selling <ArrowRight size={18}/></button></section>
  </main>
  <footer><div className="footer-brand"><span className="brand-mark">J</span><div><strong>JARK Market</strong><small>Built for the people who make things happen.</small></div></div><span>© 2026 JARK Market</span></footer>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);