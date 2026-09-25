import {supabase,supabaseConfigured} from './supabase';

export function isConfigured(){return supabaseConfigured}
export async function signInWithPassword(email,password){
  if(!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signInWithPassword({email,password});
}
export async function signUpWithPassword({email,password,name,role='customer'}){
  if(!supabase) throw new Error('Supabase is not configured.');
  const safeRole=role==='provider'?'provider':'customer';
  return supabase.auth.signUp({email,password,options:{data:{name,role:safeRole}}});
}
export async function signInWithGoogle(){
  if(!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});
}
