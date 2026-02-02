import OrderForm from '@/components/OrderForm'
import Image from 'next/image'

export default function OrderSection() {

  return (
    <section className="w-full py-16" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-[30px] sm:px-0">
        <div className="space-y-8 flex flex-col justify-center items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-center lg:text-left">
              Персональне відеопривітання <br />
              <span className="text-muted-foreground">до дня народження дитини</span>
            </h2>

            <h5 className="text-lg text-muted-foreground max-w-xl text-center lg:text-left">Друзі, привіт! Це я, Пані Юля!</h5>
            <h6 className="text-lg text-muted-foreground max-w-xl text-center lg:text-left">
              Якщо ваш малюк любить дивитися мій канал,
              уявіть, якою радістю стане персональне відеопривітання саме для нього чи неї 💛
            </h6>

            <div className="relative lg:hidden">
              <div className="flex justify-center">
                <Image
                  src="/images/form_img.png"
                  alt='Pani Yulya'
                  width={400}
                  height={500}
                  className="h-auto object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl">
              <br/>
              У святковому відео я:
              <br/>
              • звернуся до дитини на імʼя
              <br/>
              • щиро привітаю з днем народження
              <br/>
              • заспіваю пісеньку
              <br/>
              • створю теплу, радісну атмосферу свята
            </p>
          </div>
          <OrderForm />
        </div>

        <div className="relative lg:block hidden">
          <div className="flex justify-center">
            <Image
              src="/images/form_img.png"
              alt='Pani Yulya'
              width={400}
              height={500}
              className="h-auto object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
