import HomeContainer from '@/containers/Home';
/* import { manualSendEmails } from '@/app/manual-actions' */

export const metadata = {
  title: 'Pani Yulya Kids — Музика для дітей та відео привітання',
  description: 'Офіційний сайт Pani Yulya Kids. Замовляйте персональні відеопривітання для дітей, слухайте улюблену музику вдома, на вулиці або в дорозі. Навчання та розваги українською мовою.',
};

export default function Home() {
  /* manualSendEmails() */ // use only if error happens during payment
  return <HomeContainer />
}
