import HomeContainer from '@/containers/Home';
/* import { manualSendEmails } from '@/app/manual-actions' */

export const metadata = {
  title: 'Pani Yulya Kids — Музика для дітей та відео привітання',
  description: 'Офіційний сайт Pani Yulya Kids. Замовляйте персональні відеопривітання для дітей, слухайте улюблену музику вдома, на вулиці або в дорозі. Навчання та розваги українською мовою.',
};

export default function Home() {
  // use only if error happens during payment
  /* manualSendEmails('698a3208593a3b83d6d13d84') */
  return <HomeContainer />
}
