import { redirect } from 'next/navigation';

export default function BusesFallbackPage() {
  redirect('/search');
}
