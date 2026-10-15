// Visitor-facing strings. Source: copy/ru.md, copy/en.md, copy/ui-copy-matrix.md, implementation/demo-prices.md,
// copy/product-copy-templates.md. Lines marked "new" are demo transcreations; none of them adds a fact.

export const links = {
  whatsapp: 'https://wa.me/79254956265',
  telegram: 'https://t.me/sf_jew',
  instagram: 'https://www.instagram.com/sf_diamonds/',
  channel: 'https://t.me/Jewerly_store_sf',
  reviews: 'https://t.me/otzuvi_Sf',
};

export const categories = ['rings', 'earrings', 'bracelets', 'necklaces', 'watches'] as const;
export type Category = (typeof categories)[number];

type EnquiryVars = { name: string; price: string; url: string; size: string; date: string };

const ru = {
  locale: 'ru-RU',
  siteTitle: 'SF Diamonds',
  // Full search phrases for <title>: no dashes or separators, brand at the end.
  seo: {
    home: 'Ювелирные украшения с бриллиантами в Москве SF Diamonds',
    collection: 'Каталог украшений с бриллиантами из золота 750 пробы SF Diamonds',
    rings: 'Кольца с бриллиантами из белого и жёлтого золота SF Diamonds',
    earrings: 'Серьги и пусеты с бриллиантами SF Diamonds',
    bracelets: 'Теннисные браслеты с бриллиантами SF Diamonds',
    necklaces: 'Колье и подвески с бриллиантами SF Diamonds',
    watches: 'Женские часы SF Diamonds',
    bespoke: 'Ювелирные украшения с бриллиантами на заказ SF Diamonds',
    engagement: 'Помолвочные кольца с бриллиантом на заказ SF Diamonds',
    materials: 'Золото 750 пробы и природные бриллианты в украшениях SF Diamonds',
    about: 'О ювелирном бренде SF Diamonds',
    service: 'Доставка и уход за украшениями с бриллиантами SF Diamonds',
    availability: 'Украшения с бриллиантами в наличии SF Diamonds',
    viewing: 'Примерка украшений с бриллиантами SF Diamonds',
    faq: 'Ответы на вопросы о заказе украшений SF Diamonds',
    contact: 'Контакты ювелирного бренда SF Diamonds',
    shortlist: 'Ваша подборка украшений SF Diamonds',
    notFound: 'Страница не найдена SF Diamonds',
    product: '{name} с бриллиантами SF Diamonds',
  },
  description: 'Кольца, серьги, браслеты, колье и часы. Рассмотрите детали и обсудите выбор с SF.',
  skip: 'Перейти к содержанию',
  nav: {
    home: 'SF Diamonds, на главную', main: 'Основная навигация', footer: 'Разделы сайта',
    collection: 'Коллекция', bespoke: 'Индивидуальный заказ', engagement: 'Помолвочные кольца', about: 'О SF',
    materials: 'Материалы и камни', viewing: 'Примерка', contact: 'Контакты', faq: 'Вопросы', service: 'Получение и уход',
    availability: 'Наличие', shortlist: 'Подборка', menu: 'Меню', close: 'Закрыть меню', language: 'Язык',
  },
  localeName: { ru: 'Русский', en: 'Английский' },
  alts: {
    'sec-engagement': 'Кольцо с розовым бриллиантом грушевидной огранки в бархатном футляре',
    'sec-bespoke-wide': 'Кольцо с голубым камнем грушевидной формы в ореоле из бриллиантов',
    'sec-bespoke-emerald': 'Кольцо с изумрудом в ореоле из бриллиантов',
    'sec-closing': 'Теннисное колье на бархатном бюсте',
    'sec-collection': 'Браслет с жёлтыми бриллиантами на бархате',
    'page-bespoke': 'Серьги-подвески с бриллиантами изумрудной огранки',
    'page-engagement': 'Три кольца с жёлтыми бриллиантами в бархатном лотке',
    'about-emerald': 'Колье с изумрудом',
    'about-studs': 'Пусеты с круглыми бриллиантами крупным планом',
    'ig-hands-rings': 'Руки с кольцами и браслетами SF на фоне цветов',
    'ig-coffee': 'Колье с бабочками и кольца SF за чашкой кофе',
    'ig-neckline': 'Колье с бриллиантовыми бабочками на шее',
    'ig-blazer': 'Кольца и браслеты SF в повседневном образе',
    'ig-trench': 'Браслет SF на запястье, светлый тренч',
  },
  opensWhatsApp: 'откроется WhatsApp',
  hero: {
    // Hero slogans: shown one after another, two lines each. The first one is also the big line in About.
    slogans: [['Носить,', 'не снимая.'], ['Для себя,', 'просто так.'], ['Для самого', 'важного «да».']],
    sub: 'Кольца, серьги, браслеты и колье с бриллиантами. Выберите сами или напишите нам, поможем подобрать.',
    primary: 'Смотреть коллекцию',
    secondary: 'Помогите выбрать',
    sceneLabel: 'Кольцо с бриллиантом овальной огранки',
  },
  categories: {
    h2: 'С чего начнём?',
    body: 'Выберите, что вам ближе, а с размером и деталями поможем в переписке.',
    names: { rings: 'Кольца', earrings: 'Серьги', bracelets: 'Браслеты', necklaces: 'Колье и подвески', watches: 'Часы' },
    watches: 'Смотреть часы',
  },
  prices: {
    h2: 'Цены видно сразу',
    regular: 'Обычная цена:',
    onRequest: 'Цена по запросу', // new
    all: 'Вся коллекция', // new
  },
  bespokeTeaser: {
    h2: 'Есть идея для своего украшения?',
    body: 'Пришлите картинку, набросок или просто расскажите, для кого украшение. С бюджетом и датой сразу предложим подходящие варианты.',
    cta: 'Рассказать об идее',
  },
  viewingTeaser: {
    h2: 'Хотите увидеть украшение вживую?',
    body: 'Напишите, какие модели понравились и в каком вы городе. Подскажем, где и когда можно примерить.',
    cta: 'Спросить про примерку',
  },
  closing: {
    h2: 'Напишите нам',
    body: 'Пришлите модель из коллекции, скриншот или просто идею. Подскажем по размеру и цене, а решение останется за вами.',
    message: 'Здравствуйте! Хочу обсудить украшение.', // new
  },
  home: { // new: labels for the full-screen home panels
    panels: ['SF Diamonds', 'Коллекция', 'Цены', 'Из канала', 'Индивидуальный заказ', 'Помолвка', 'О SF', 'Контакты'],
    inPost: 'В публикации: {count}',
    open: 'Смотреть',
    prev: 'Предыдущие', next: 'Следующие',
    renders: 'Огранки центрального камня',
    render: 'Огранка: {n}',
    cuts: ['овал', 'радиант', 'груша', 'круг'],
    stones: 'Камней в публикации: {count}',
  },
  // Real photos and wording from public posts of t.me/Jewerly_store_sf. Specs are quoted as the post states them;
  // prices and stock notes are left out on purpose (the six demo prices stay the only prices on the site).
  channel: {
    h2: 'Так они выглядят вживую',
    quote: 'Фото из нашего Telegram-канала: на руке, при дневном свете, без студийного глянца.',
    open: 'Открыть канал',
    feature: { img: 'tg-bracelet-studio', id: 3313, date: '18.09.2026', title: 'Теннисный браслет', specs: ['Общий вес бриллиантов 7,5 карата', 'Белое золото 750 пробы', 'Характеристики камней H/VS1'] },
    items: [
      { img: 'tg-bracelets-tray', id: 2715, title: 'Теннисные браслеты' },
      { img: 'tg-bracelets-dark', id: 2537, title: 'Теннисные браслеты на руке' },
      { img: 'tg-tennis-layers', id: 2734, title: 'Теннисные колье от 5 до 15 карат' },
    ],
  },
  cta: {
    collection: 'Смотреть коллекцию', help: 'Помогите выбрать', enquire: 'Обсудить это украшение', availability: 'Уточнить наличие',
    viewing: 'Обсудить примерку', reference: 'Отправить пример', whatsapp: 'Написать в WhatsApp', telegram: 'Написать в Telegram',
    copy: 'Скопировать сообщение', copied: 'Сообщение скопировано', contact: 'Связаться с SF',
  },
  copyFailed: 'Не удалось скопировать. Выделите текст и скопируйте вручную.', // new
  filter: {
    category: 'Тип украшения', all: 'Все украшения', sort: 'Сортировка', default: 'Как в публикации',
    asc: 'Сначала дешевле', desc: 'Сначала дороже', count: 'Найдено: {count}',
    budget: 'Бюджет', budgets: ['До 100 000', 'От 100 000 до 200 000', 'От 200 000'], anyBudget: 'Любой', // new
    emptyTitle: 'По этим условиям ничего не найдено', emptyBody: 'Сбросьте часть фильтров или отправьте нам пример того, что ищете',
    emptyCategory: 'В демонстрационном каталоге этого раздела пока нет моделей. Напишите, что ищете, и мы подскажем варианты.', // new
  },
  collection: {
    title: 'Коллекция',
    h1: 'Выберите то, что хочется носить',
    lead: 'Понравилось несколько? Сохраните их в подборку и отправьте нам одним сообщением.',
    intros: {
      rings: 'Одно кольцо на каждый день или несколько вместе. Посмотрите на ширину шинки, посадку камня и профиль: именно они определяют, как кольцо ощущается на руке.',
      earrings: 'Ближе к мочке или ниже линии подбородка. Оцените длину, застёжку и вес пары, чтобы выбрать удобный формат.',
      bracelets: 'Тонкая линия на запястье или заметный акцент. Сравните размер, ширину и способ застёгивания; для жёсткого браслета особенно важна посадка.',
      necklaces: 'Одна деталь меняет весь образ. Длина цепи и размер подвески помогут понять, где украшение окажется относительно выреза.',
      watches: 'Посмотрите на размер корпуса, посадку браслета и детали циферблата. Перед заказом уточните комплектацию, происхождение и документы выбранной модели.',
    },
    after: 'Не нашли нужную форму? Покажите, что ищете.',
    referenceMessage: 'Здравствуйте! Ищу украшение. Пример:', // new
  },
  product: {
    back: 'Вся коллекция', // new
    under: 'Пришлите модель и нужный размер. Актуальную стоимость, доступность и сроки подтвердят до заказа.',
    sizeLabel: 'Нужный размер', // new
    sizeInPost: 'Размер в публикации: {size}', // new
    sizeUnknown: 'Пока не знаю размер',
    sizeHint: 'Не знаете размер? Напишите об этом при обращении.',
    specs: 'Характеристики', fit: 'Размер и посадка', documents: 'Камни и документы', terms: 'Получение и условия',
    specsBody: 'Металл, проба, покрытие и вес в публикации не указаны. Уточните их для этой модели при обращении.', // new
    fitSized: 'В публикации указан размер {size}. Возможность другого размера зависит от конструкции, уточните её до заказа.', // new
    fitUnsized: 'Размеры в публикации не указаны. Попросите длину, ширину и фото на человеке, чтобы оценить посадку.', // new
    stonesStated: 'В публикации упомянуто камней: {stones}. Происхождение, вес и документы для них не указаны, запросите их до заказа.', // new
    stonesUnknown: 'Камни и документы в публикации не описаны. Уточните происхождение и характеристики для этой модели.', // new
    termsBody: 'Доставка, оплата, изменение размера и возврат согласуются до оплаты.', // new
    termsLink: 'Какие вопросы задать до заказа',
    message: ({ name, price, url, size, date }: EnquiryVars) => `Здравствуйте! Мне понравилась модель «${name}» (${price ? `${price} в публикации` : 'публикация'} SF от ${date}): ${url}. Интересует размер: ${size || 'пока не знаю'}. Подскажите актуальную стоимость, валюту, наличие и возможность примерки.`,
    unknown: 'Модель не найдена', // new
    photoNote: 'Фото из канала SF, фон обработан.', // new
    aiNote: 'Иллюстрация создана ИИ по описанию из публикации, это не фото изделия. Попросите фото при обращении.',
    postLink: 'Публикация в канале SF', // new
    docsAsk: 'Документы на камни в публикации не указаны. Запросите их до заказа.', // new
  },
  shortlist: {
    title: 'Подборка',
    h1: 'Ваша подборка',
    lead: 'Модели сохраняются только в этом браузере. Перед отправкой проверьте текст сообщения.', // new
    add: 'Сохранить в подборку', remove: 'Убрать из подборки', saved: 'Украшение сохранено',
    empty: 'Сохраните украшения, которые хотите сравнить', send: 'Отправить подборку',
    unavailable: 'Модель больше не доступна в каталоге',
    preview: 'Текст сообщения', // new
    preamble: 'Здравствуйте! Хочу обсудить подборку с сайта SF:', // new
    tgNote: 'Telegram не принимает готовый текст по ссылке: скопируйте сообщение и вставьте его в чат.', // new
    count: 'Подборка: {count}', // new
  },
  form: {
    name: 'Имя', channel: 'Как с вами связаться', contact: 'Контакт', message: 'Что вы ищете?', city: 'Город',
    budget: 'Бюджет, необязательно', date: 'Желаемая дата, необязательно', reference: 'Ссылка на пример, необязательно',
    required: 'Обязательное поле', contactError: 'Проверьте контакт, чтобы с вами можно было связаться',
    prepare: 'Подготовить сообщение в WhatsApp', noServer: 'Это предварительный текст сообщения. Отправьте его в открывшемся мессенджере',
    note: 'Номер или имя пользователя нужны, чтобы обсудить ваш запрос. Не добавляйте платёжные данные.',
    channels: ['WhatsApp', 'Telegram', 'Телефон'], // new
    open: 'Открыть WhatsApp', // new
    edit: 'Изменить', // new
    intro: 'Здравствуйте! Хочу обсудить примерку.', // new
  },
  pages: {
    bespoke: {
      title: 'Индивидуальный заказ',
      h1: 'Начнём с вашей идеи',
      lead: 'Иногда есть точная картинка, иногда только повод. Подойдёт и то, и другое: расскажите, что хотите носить, и мы предложим варианты.',
      cta: 'Рассказать об идее',
      message: 'Здравствуйте! Хочу обсудить индивидуальный заказ. Моя идея:',
      sections: [
        ['С чего начать', 'Фото примера или форма, металл, размер, бюджет и дата. Хватит и одного пункта, остальное уточним вместе.'],
        ['Всё обговариваем заранее', 'До заказа согласуем параметры, итоговую стоимость, оплату и сроки. Если украшение делается с нуля, подскажем, до какого этапа можно вносить правки.'],
        ['Если это подарок', 'Расскажите, что человек уже носит: белое или жёлтое золото, строгие формы или заметные детали. Фото любимого украшения скажет больше длинного описания.'],
      ],
      finalCta: 'Отправить идею в WhatsApp',
    },
    engagement: {
      title: 'Помолвочные кольца',
      h1: 'Кольцо для вашего «да»',
      lead: 'Начните с человека, которому выбираете кольцо: что он носит и что ему нравится. Потом форма камня, металл и посадка. Сомневаетесь? Пришлите бюджет и пару примеров, дальше поможем.',
      cta: 'Подобрать кольцо', secondary: 'Смотреть кольца',
      message: 'Здравствуйте! Помогите выбрать помолвочное кольцо.',
      sections: [
        ['На что смотреть', 'Форма и видимый размер камня, высота закрепки, ширина шинки и то, как кольцо встанет рядом с обручальным. Караты важны, но как кольцо смотрится на руке, решают именно эти детали.'],
        ['Не знаете размер?', 'Это нормально, угадывать не нужно. Напишите нам, и мы подскажем, как его узнать и можно ли потом изменить размер выбранной модели.'],
        ['Есть важная дата?', 'Назовите её сразу. Наличие, изготовление и доставку обговорим заранее, чтобы вы спокойно всё спланировали.'],
      ],
      finalCta: 'Помогите с выбором',
    },
    materials: {
      title: 'Материалы и камни',
      h1: 'Детали, которые стоит знать',
      lead: 'У украшения есть форма, которую вы видите, и характеристики, которые нужно уточнить. Сравнивайте их по конкретному изделию.',
      message: 'Здравствуйте! Хочу уточнить характеристики украшения:',
      sections: [
        ['Металл', 'Уточните материал, пробу, цвет и наличие покрытия. Внешний цвет не подтверждает состав, а одинаковая проба не означает одинаковый вес изделия.'],
        ['Камень', 'Происхождение, форма огранки, вес, цвет и чистота являются отдельными параметрами. Для нескольких камней важно понять, указан вес одного камня или суммарный вес вставок.'],
        ['Документы', 'Если к камню заявлен геммологический отчёт, попросите его номер и проверьте, что он относится к этому камню. Фото и блеск не заменяют документ.'],
        ['Размер и посадка', 'Для кольца важны размер и профиль; для серьги длина, застёжка и вес; для цепи длина; для браслета внутренний размер и способ надевания.'],
      ],
      finalCta: 'Уточнить характеристики украшения',
    },
    about: {
      title: 'О SF',
      h1: 'SF Diamonds',
      lead: 'Украшения и часы. Подбираем по деталям, без спешки.',
      sections: [
        [null, 'Можно начать с готовой модели из коллекции, а можно с идеи, фото или повода. Материал, размер, стоимость и сроки обговорим до того, как вы что-то решите.'],
        ['Без спешки и догадок', 'Красивое фото только начало. Чтобы решить, нужны характеристики, фото на руке и понятные условия. Спросите всё, чего не хватает: ответим до заказа.'],
      ],
    },
    service: {
      title: 'Получение и уход',
      h1: 'Все важные вопросы до заказа',
      lead: 'Где вы хотите получить украшение? К какой дате? Нужна ли примерка? Обсудите это вместе с выбранной моделью.',
      message: 'Здравствуйте! У меня вопрос по заказу:',
      sections: [
        ['Получение', 'Уточните доступность доставки в ваш город, её стоимость, предполагаемую дату и порядок передачи. Для международной доставки отдельно обсудите возможные сборы и документы.'],
        ['Изменение размера и уход', 'Возможность изменения размера зависит от конструкции украшения. Перед заказом уточните её для выбранной модели, а после получения запросите рекомендации по уходу за материалом и камнями.'],
        ['Оплата, изменения и возврат', 'Согласуйте порядок оплаты, условия отмены и изменения заказа, возврата и обслуживания до внесения оплаты. Для готового изделия и индивидуального изготовления условия могут отличаться.'],
      ],
      finalCta: 'Задать вопрос по заказу',
    },
    availability: {
      title: 'Наличие',
      h1: 'Хотите выбрать из наличия?',
      lead: 'Напишите, что ищете, в каком городе и к какой дате. Наличие и возможность примерки подтвердят для конкретного украшения.',
      message: 'Здравствуйте! Хочу выбрать украшение из наличия. Ищу: . Город: . Дата: .',
      cta: 'Уточнить наличие',
    },
    viewing: {
      title: 'Примерка',
      h1: 'Выбирайте с деталями перед глазами',
      lead: 'Уже понравилась модель? Пришлите её ссылку. Ещё ищете? Расскажите, для кого выбираете, какой бюджет рассматриваете и к какой дате нужно украшение.',
      h2: 'Обсудить примерку',
      body: 'Укажите город и модели, которые хотите увидеть. Возможность, место и время примерки согласовываются отдельно.',
    },
    faq: {
      title: 'Вопросы',
      h1: 'Вопросы', // new: copy gives no H1 for FAQ
      items: [
        ['Можно увидеть украшение до заказа?', 'Напишите нам город и модель. Подскажем, можно ли примерить, где и когда.'],
        ['Как узнать, есть ли мой размер?', 'Откройте понравившуюся модель и отправьте запрос с нужным размером. Если размер неизвестен, напишите об этом.'],
        ['Можно заказать своё украшение?', 'Да, мы принимаем индивидуальные заказы. Пришлите идею или пример, и мы расскажем, что возможно, и посчитаем стоимость.'],
        ['Как узнать итоговую стоимость?', 'Для готовой модели запросите актуальную цену и валюту. Для индивидуального заказа сначала согласуйте материал, камни, размер и другие параметры.'],
        ['Какие камни используются?', 'Уточняйте происхождение и характеристики по конкретному украшению. Не делайте вывод только по фотографии или общему описанию марки.'],
        ['У каждого камня есть GIA?', 'Наличие отчёта нужно подтвердить для выбранного камня. Если он заявлен, запросите номер и соответствующий документ.'],
        ['Сколько занимает изготовление?', 'Срок зависит от заказа и согласовывается отдельно. Если украшение нужно к событию, укажите дату в первом сообщении.'],
        ['Можно доставить в другую страну?', 'Укажите страну и город. До оплаты уточните возможность доставки, стоимость, документы и возможные дополнительные сборы.'],
        ['Можно изменить размер или вернуть изделие?', 'Обсудите условия для конкретной модели до оплаты. Конструкция и индивидуальные изменения могут влиять на доступные варианты.'],
        ['Как выбрать подарок, если я сомневаюсь?', 'Пришлите фото украшений, которые человек носит, или сохраните несколько вариантов. Укажите повод, бюджет и дату, с ними проще начать подбор.'],
      ],
      // Topics split items in order: [title, number of items].
      groups: [['Заказ и цена', 4], ['Камни и документы', 2], ['Сроки, доставка, возврат', 3], ['Подарок', 1]],
      topics: 'Темы',
      help: { h2: 'Не нашли ответ?', body: 'Напишите вопрос и, если есть, ссылку на модель. Ответим по конкретному украшению.' },
    },
    contact: {
      title: 'Контакты',
      h1: 'Обсудим ваше украшение',
      lead: 'Пришлите модель, подборку или идею. Чтобы разговор сразу был предметным, добавьте размер, город и дату, если они уже известны.',
      // Channel cards: [title, text, button, link key].
      cards: [
        ['WhatsApp', 'Пришлите ссылку или фото модели, размер и город, если они известны.', 'Написать', 'whatsapp'],
        ['Telegram', 'Личные сообщения SF: вопросы о моделях, наличии и примерке.', 'Написать', 'telegram'],
        ['Канал SF', 'Новые поступления и украшения с ценами из публикаций.', 'Открыть канал', 'channel'],
        ['Instagram', '@sf_diamonds: украшения в образах и на руке.', 'Открыть профиль', 'instagram'],
        ['Отзывы', 'Отзывы покупателей SF в отдельном Telegram-канале.', 'Читать отзывы', 'reviews'],
      ],
      faqCard: ['Частые вопросы', 'Примерка, размер, камни, сроки и доставка: короткие ответы на одной странице.', 'Открыть вопросы'],
    },
    notFound: { title: 'Страница не найдена', h1: 'Страница не найдена', back: 'Вернуться в коллекцию' },
  },
  footer: {
    line: 'SF Diamonds: украшения и часы.',
    instagram: 'Instagram', channel: 'Telegram-канал', reviews: 'Отзывы в Telegram',
    fonts: 'Шрифты Cormorant Garamond, Manrope и Unbounded по лицензии SIL Open Font License.', // new
    photos: 'Фото украшений из канала SF. На части снимков фон и свет изменены с помощью ИИ, камни оригинальные. Часть изображений у цен из публикации 06.09.2026 полностью создана ИИ, это указано на странице изделия.', // new
  },
};

const en: Dict = {
  locale: 'en-GB',
  siteTitle: 'SF Diamonds',
  seo: {
    home: 'Diamond Jewellery in Moscow by SF Diamonds',
    collection: 'Diamond Jewellery in 18k Gold by SF Diamonds',
    rings: 'Diamond Rings in White and Yellow Gold by SF Diamonds',
    earrings: 'Diamond Earrings and Studs by SF Diamonds',
    bracelets: 'Diamond Tennis Bracelets by SF Diamonds',
    necklaces: 'Diamond Necklaces and Pendants by SF Diamonds',
    watches: 'Women’s Watches by SF Diamonds',
    bespoke: 'Bespoke Diamond Jewellery by SF Diamonds',
    engagement: 'Bespoke Diamond Engagement Rings by SF Diamonds',
    materials: '18k Gold and Natural Diamonds in SF Diamonds Jewellery',
    about: 'About the Jewellery Brand SF Diamonds',
    service: 'Delivery and Care for Diamond Jewellery by SF Diamonds',
    availability: 'Diamond Jewellery in Stock at SF Diamonds',
    viewing: 'Book a Diamond Jewellery Viewing with SF Diamonds',
    faq: 'Questions About Ordering Jewellery from SF Diamonds',
    contact: 'Contact the Jewellery Brand SF Diamonds',
    shortlist: 'Your Jewellery Shortlist at SF Diamonds',
    notFound: 'Page Not Found at SF Diamonds',
    product: 'Diamond {name} by SF Diamonds',
  },
  description: 'Rings, earrings, bracelets, necklaces and watches. Look closer and talk through your choice with SF.',
  skip: 'Skip to content',
  nav: {
    home: 'SF Diamonds, home', main: 'Main navigation', footer: 'Site sections',
    collection: 'Collection', bespoke: 'Bespoke enquiries', engagement: 'Engagement rings', about: 'About SF',
    materials: 'Materials & stones', viewing: 'Viewings', contact: 'Contact', faq: 'Questions', service: 'Receiving & care',
    availability: 'Availability', shortlist: 'Shortlist', menu: 'Menu', close: 'Close menu', language: 'Language',
  },
  localeName: { ru: 'Russian', en: 'English' },
  alts: {
    'sec-engagement': 'Pink pear-shaped diamond ring in a velvet box',
    'sec-bespoke-wide': 'Ring with a pear-shaped blue stone in a diamond halo',
    'sec-bespoke-emerald': 'Emerald ring with a diamond halo',
    'sec-closing': 'Tennis necklace on a velvet bust',
    'sec-collection': 'Yellow diamond bracelet on velvet',
    'page-bespoke': 'Emerald-cut diamond drop earrings',
    'page-engagement': 'Three yellow diamond rings in a velvet tray',
    'about-emerald': 'Emerald necklace',
    'about-studs': 'Round diamond stud earrings in close-up',
    'ig-hands-rings': 'Hands wearing SF rings and bracelets in front of flowers',
    'ig-coffee': 'SF butterfly necklace and rings over a cup of coffee',
    'ig-neckline': 'Diamond butterfly necklace on the neckline',
    'ig-blazer': 'SF rings and bracelets in an everyday look',
    'ig-trench': 'SF bracelet on the wrist with a light trench coat',
  },
  opensWhatsApp: 'opens WhatsApp',
  hero: {
    slogans: [['Too good', 'to take off.'], ['For yourself,', 'just because.'], ['For the most', 'important “yes”.']],
    sub: 'Diamond rings, earrings, bracelets and necklaces. Choose for yourself, or message us and we will help.',
    primary: 'Explore the collection',
    secondary: 'Help me choose',
    sceneLabel: 'Oval diamond ring',
  },
  categories: {
    h2: 'Where shall we start?',
    body: 'Pick what feels closest. We will help with the size and details in a message.',
    names: { rings: 'Rings', earrings: 'Earrings', bracelets: 'Bracelets', necklaces: 'Necklaces & pendants', watches: 'Watches' },
    watches: 'Explore watches',
  },
  prices: {
    h2: 'Prices up front',
    regular: 'Regular price:',
    onRequest: 'Price on request',
    all: 'The whole collection',
  },
  bespokeTeaser: {
    h2: 'Have a piece in mind?',
    body: 'Send a picture, a sketch or simply tell us who the piece is for. With a budget and a date, we can suggest options straight away.',
    cta: 'Share your idea',
  },
  viewingTeaser: {
    h2: 'Want to see a piece in person?',
    body: 'Tell us which pieces you like and where you are. We will let you know where and when you can try them on.',
    cta: 'Ask about a viewing',
  },
  closing: {
    h2: 'Get in touch',
    body: 'Send a piece from the collection, a screenshot or just an idea. We will help with the size and price, and the decision stays yours.',
    message: 'Hello! I would like to discuss a piece.',
  },
  home: {
    panels: ['SF Diamonds', 'Collection', 'Prices', 'From the channel', 'Bespoke', 'Engagement', 'About SF', 'Contact'],
    inPost: 'In the post: {count}',
    open: 'Explore',
    prev: 'Previous', next: 'Next',
    renders: 'Centre stone cuts',
    render: 'Cut: {n}',
    cuts: ['oval', 'radiant', 'pear', 'round'],
    stones: 'Stones in the post: {count}',
  },
  channel: {
    h2: 'How they look in real life',
    quote: 'Photos from our Telegram channel: on the hand, in daylight, without studio gloss.',
    open: 'Open the channel',
    feature: { img: 'tg-bracelet-studio', id: 3313, date: '18.09.2026', title: 'Tennis bracelet', specs: ['Total diamond weight 7.5 ct', '18k (750) white gold', 'Stones H/VS1'] },
    items: [
      { img: 'tg-bracelets-tray', id: 2715, title: 'Tennis bracelets' },
      { img: 'tg-bracelets-dark', id: 2537, title: 'Tennis bracelets on the wrist' },
      { img: 'tg-tennis-layers', id: 2734, title: 'Tennis necklaces from 5 to 15 ct' },
    ],
  },
  cta: {
    collection: 'Explore the collection', help: 'Help me choose', enquire: 'Enquire about this piece', availability: 'Check availability',
    viewing: 'Discuss a viewing', reference: 'Share a reference', whatsapp: 'Message on WhatsApp', telegram: 'Message on Telegram',
    copy: 'Copy message', copied: 'Message copied', contact: 'Contact SF',
  },
  copyFailed: 'Could not copy. Select the text and copy it manually.',
  filter: {
    category: 'Piece type', all: 'All pieces', sort: 'Sort by', default: 'As in the post',
    asc: 'Price: low to high', desc: 'Price: high to low', count: 'Pieces found: {count}',
    budget: 'Budget', budgets: ['Under 100,000', '100,000 to 200,000', 'From 200,000'], anyBudget: 'Any',
    emptyTitle: 'No pieces match these filters', emptyBody: 'Remove some filters or share a reference of what you are looking for',
    emptyCategory: 'The demo collection has no pieces in this section yet. Tell us what you are looking for and we will suggest options.',
  },
  collection: {
    title: 'Collection',
    h1: 'Find a piece you want to wear',
    lead: 'Like a few? Save them to your shortlist and send them to us in one message.',
    intros: {
      rings: 'One ring for every day, or a few worn together. Look at the band width, setting and side profile: these details shape how a ring feels on your hand.',
      earrings: 'Close to the ear or below the jawline. Compare the length, fastening and weight of the pair to find a comfortable style.',
      bracelets: 'A fine line around the wrist or a more noticeable accent. Compare the size, width and fastening. For a rigid bracelet, the fit is especially important.',
      necklaces: 'One detail can change the whole look. Chain length and pendant dimensions help you see where a piece will sit against a neckline.',
      watches: 'Consider the case size, bracelet fit and dial details. Before ordering, confirm what is included, the provenance and the documents for that particular watch.',
    },
    after: 'Looking for a different shape? Show us what you have in mind.',
    referenceMessage: 'Hello! I am looking for a piece. Reference:',
  },
  product: {
    back: 'The whole collection',
    under: 'Share the piece and your preferred size. Current price, availability and timing are confirmed before ordering.',
    sizeLabel: 'Preferred size',
    sizeInPost: 'Size in the post: {size}',
    sizeUnknown: 'I do not know my size yet',
    sizeHint: 'Unsure of your size? Mention it in your enquiry.',
    specs: 'Specifications', fit: 'Size & fit', documents: 'Stones & documents', terms: 'Receiving your piece & terms',
    specsBody: 'The metal, fineness, plating and weight are not stated in the post. Ask about them for this piece when you enquire.',
    fitSized: 'The post lists size {size}. Whether another size is possible depends on the design: confirm it before ordering.',
    fitUnsized: 'Dimensions are not stated in the post. Ask for the length, width and on-body photographs to judge the fit.',
    stonesStated: 'The post mentions {stones} stones. Their origin, weight and documents are not stated: request them before ordering.',
    stonesUnknown: 'The post does not describe stones or documents. Confirm the origin and specifications for this piece.',
    termsBody: 'Delivery, payment, resizing and returns are agreed before paying.',
    termsLink: 'The questions to ask before ordering',
    message: ({ name, price, url, size, date }: EnquiryVars) => `Hello, I’m interested in the “${name}” (${price ? `${price} in` : 'from'} SF’s post of ${date}): ${url}. My preferred size is ${size || 'not sure yet'}. Could you confirm the current price, currency, availability and viewing options?`,
    unknown: 'Piece not found',
    photoNote: 'Photo from the SF channel, background edited.',
    aiNote: 'AI illustration based on the post’s description, not a photo of the piece. Ask for photos when you enquire.',
    postLink: 'The post in the SF channel',
    docsAsk: 'Stone documents are not stated in the post. Ask for them before ordering.',
  },
  shortlist: {
    title: 'Shortlist',
    h1: 'Your shortlist',
    lead: 'Pieces are saved in this browser only. Check the message before sending it.',
    add: 'Add to shortlist', remove: 'Remove from shortlist', saved: 'Piece saved',
    empty: 'Save the pieces you want to compare', send: 'Send your shortlist',
    unavailable: 'This piece is no longer in the collection',
    preview: 'Message text',
    preamble: 'Hello! I would like to discuss a shortlist from the SF website:',
    tgNote: 'Telegram links cannot carry a prepared message: copy it and paste it into the chat.',
    count: 'Shortlist: {count}',
  },
  form: {
    name: 'Name', channel: 'Preferred contact method', contact: 'Contact details', message: 'What are you looking for?', city: 'City',
    budget: 'Budget, optional', date: 'Preferred date, optional', reference: 'Reference link, optional',
    required: 'Required field', contactError: 'Check your contact details so SF can reach you',
    prepare: 'Prepare a WhatsApp message', noServer: 'This is a message preview. Send it in the messenger that opens',
    note: 'Your number or username is needed to discuss your enquiry. Please do not include payment details.',
    channels: ['WhatsApp', 'Telegram', 'Phone'],
    open: 'Open WhatsApp',
    edit: 'Edit',
    intro: 'Hello! I would like to discuss a viewing.',
  },
  pages: {
    bespoke: {
      title: 'Bespoke enquiries',
      h1: 'Let’s start with your idea',
      lead: 'Sometimes there is an exact picture, sometimes just an occasion. Either works: tell us what you would like to wear and we will suggest options.',
      cta: 'Share your idea',
      message: 'Hello! I would like to discuss a bespoke piece. My idea:',
      sections: [
        ['Where to start', 'A reference photo or a shape, the metal, the size, a budget and a date. One of these is enough; we will work out the rest together.'],
        ['Everything agreed up front', 'Before ordering, we agree the specifications, total price, payment and timing. If the piece is made from scratch, we will tell you until which stage changes are possible.'],
        ['Choosing a gift?', 'Tell us what the person already wears: white or yellow gold, clean shapes or bolder details. A photo of a favourite piece says more than a long description.'],
      ],
      finalCta: 'Share your idea on WhatsApp',
    },
    engagement: {
      title: 'Engagement rings',
      h1: 'A ring for your “yes”',
      lead: 'Start with the person you are choosing for: what they wear and what they love. Then the stone shape, metal and setting. Unsure? Send a budget and a couple of references and we will take it from there.',
      cta: 'Find the ring', secondary: 'Explore rings',
      message: 'Hello! Could you help me choose an engagement ring?',
      sections: [
        ['What to look at', 'The stone shape and visible size, the setting height, the band width and how the ring will sit beside a wedding band. Carats matter, but these details decide how the ring looks on the hand.'],
        ['Unsure of the size?', 'That is fine, there is no need to guess. Message us and we will explain how to measure it and whether the ring can be resized later.'],
        ['Have an important date?', 'Tell us at the start. We will go through availability, making time and delivery up front, so you can plan with ease.'],
      ],
      finalCta: 'Help me choose',
    },
    materials: {
      title: 'Materials & stones',
      h1: 'Details worth knowing',
      lead: 'Every piece has a shape you can see and specifications you need to confirm. Compare them for the particular piece you are considering.',
      message: 'Hello! I would like to confirm the specifications of a piece:',
      sections: [
        ['The metal', 'Ask about the material, fineness, colour and any plating. Colour alone does not establish composition, and matching fineness does not mean matching weight.'],
        ['The stone', 'Origin, cut shape, weight, colour and clarity are separate details. With several stones, check whether the listed weight is for one stone or the total weight of the setting.'],
        ['The documents', 'If a gemmological report is stated, request its number and check that it applies to that stone. A photograph and sparkle do not replace a document.'],
        ['Size and fit', 'For a ring, consider its size and profile; for earrings, their length, fastening and weight; for a chain, its length; for a bracelet, its internal dimensions and how it is put on.'],
      ],
      finalCta: 'Ask about a piece’s specifications',
    },
    about: {
      title: 'About SF',
      h1: 'SF Diamonds',
      lead: 'Jewellery and watches. Chosen by the details, without a rush.',
      sections: [
        [null, 'You can start with a piece from the collection, or with an idea, a photo or an occasion. We agree the material, size, price and timing before you decide anything.'],
        ['No rush, no guesswork', 'A beautiful photo is only the start. To decide, you need the specifications, on-hand photos and clear terms. Ask for anything that is missing: we will answer before you order.'],
      ],
    },
    service: {
      title: 'Receiving & care',
      h1: 'The questions to ask before ordering',
      lead: 'Where would you like to receive your piece? By which date? Would you like a viewing? Discuss these details alongside the piece you choose.',
      message: 'Hello! I have a question about an order:',
      sections: [
        ['Receiving your piece', 'Confirm delivery availability for your city, its cost, expected timing and handover arrangements. For international delivery, discuss possible charges and documents separately.'],
        ['Resizing and care', 'Resizing options depend on the design. Check them for the piece before ordering. Once you receive it, ask for care guidance for its materials and stones.'],
        ['Payment, changes and returns', 'Agree payment arrangements, cancellation, order changes, returns and servicing before paying. Terms may differ between a ready-made piece and a bespoke order.'],
      ],
      finalCta: 'Ask an order question',
    },
    availability: {
      title: 'Availability',
      h1: 'Prefer a piece that is ready now?',
      lead: 'Tell SF what you are looking for, your city and when you need it. Availability and viewing options are confirmed for each piece.',
      message: 'Hello! I would like a piece that is ready now. Looking for: . City: . Date: .',
      cta: 'Check availability',
    },
    viewing: {
      title: 'Viewings',
      h1: 'Choose with the details in view',
      lead: 'Already found a piece you like? Send its link. Still looking? Tell SF who you are choosing for, your budget and when you need the piece.',
      h2: 'Discuss a viewing',
      body: 'Include your city and the pieces you would like to see. Availability, location and timing are arranged separately.',
    },
    faq: {
      title: 'Questions',
      h1: 'Questions',
      items: [
        ['Can I see a piece before ordering?', 'Send us your city and the piece. We will tell you whether a viewing is possible, and where and when.'],
        ['How do I check whether my size is available?', 'Open the piece you like and enquire with your preferred size. If you do not know it, mention that too.'],
        ['Can I order a bespoke piece?', 'Yes, we take bespoke orders. Share your idea or a reference and we will tell you what is possible and prepare a quote.'],
        ['How do I find out the total price?', 'For a ready-made piece, ask for the current price and currency. For a bespoke order, first agree the material, stones, size and other specifications.'],
        ['What stones are used?', 'Confirm the origin and specifications of the particular piece. Do not rely solely on a photograph or a general brand description.'],
        ['Does every stone have a GIA report?', 'Report availability must be confirmed for the chosen stone. If a report is stated, ask for its number and document.'],
        ['How long does a bespoke piece take?', 'Timing depends on the order and is agreed separately. If you need the piece for an occasion, include the date in your first message.'],
        ['Can a piece be delivered to another country?', 'Send your country and city. Before paying, confirm delivery availability, cost, documents and any possible additional charges.'],
        ['Can a piece be resized or returned?', 'Discuss the terms for that particular piece before paying. Its construction and any personalisation can affect the available options.'],
        ['How do I choose a gift if I am unsure?', 'Share photographs of jewellery the person wears, or save a few options. An occasion, budget and date help start the selection.'],
      ],
      groups: [['Ordering and price', 4], ['Stones and reports', 2], ['Timing, delivery, returns', 3], ['Gifts', 1]],
      topics: 'Topics',
      help: { h2: 'Didn’t find your answer?', body: 'Send your question and, if you have one, a link to the piece. We will answer for that particular piece.' },
    },
    contact: {
      title: 'Contact',
      h1: 'Let’s talk about your piece',
      lead: 'Share a piece, a shortlist or an idea. Add the size, city and date if you know them, so the conversation can begin with useful details.',
      cards: [
        ['WhatsApp', 'Send a link or a photo of the piece, plus your size and city if you know them.', 'Message us', 'whatsapp'],
        ['Telegram', 'Direct messages to SF: questions about pieces, availability and viewings.', 'Message us', 'telegram'],
        ['SF channel', 'New arrivals and pieces with the prices from each post.', 'Open channel', 'channel'],
        ['Instagram', '@sf_diamonds: pieces styled and worn.', 'Open profile', 'instagram'],
        ['Reviews', 'Client reviews of SF in a separate Telegram channel.', 'Read reviews', 'reviews'],
      ],
      faqCard: ['Questions', 'Viewings, sizes, stones, timing and delivery: short answers on one page.', 'Open questions'],
    },
    notFound: { title: 'Page not found', h1: 'Page not found', back: 'Return to the collection' },
  },
  footer: {
    line: 'SF Diamonds jewellery and watches.',
    instagram: 'Instagram', channel: 'Telegram channel', reviews: 'Reviews on Telegram',
    fonts: 'Cormorant Garamond, Manrope and Unbounded fonts under the SIL Open Font License.',
    photos: 'Jewellery photos from the SF channel. On some, the background and light were changed with AI; the stones are original. Some pictures for the prices from the 6 September 2026 post are entirely AI-made; the piece’s page says so.',
  },
};

type Dict = typeof ru;
export type Lang = 'ru' | 'en';
export const t: Record<Lang, Dict> = { ru, en };
