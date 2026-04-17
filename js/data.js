const TOPICS = [
  {
    id: 'basics',
    name: 'Основы Arduino',
    icon: 'developer_board',
    num: '01',
    lessons: [
      {
        id: 'l1',
        title: 'Что такое Arduino?',
        duration: '5 мин',
        sections: [
          {
            type: 'text',
            content: '<strong>Arduino</strong> — программируемая плата с процессором, памятью и своим ПО. Это «мозг» электронного устройства — он управляет всем остальным.'
          },
          {
            type: 'info',
            title: 'Популярная модель',
            text: 'Arduino UNO — самая распространённая модель. С неё рекомендуем начинать обучение.'
          },
          {
            type: 'text',
            content: 'Компоненты <strong>Arduino UNO</strong>:<br><br>— Процессор ATmega328<br>— Кнопка перезагрузки<br>— USB-разъём для питания и прошивки<br>— Разъём для батарейки «Крона»<br>— <strong>6 аналоговых пинов</strong> (A0–A5)<br>— <strong>14 цифровых пинов</strong> (0–13)'
          },
          {
            type: 'info',
            title: 'Проекты',
            text: 'Умный дом, теплица, метеостанция, роботы, музыкальные инструменты — всё это реально сделать самому.'
          }
        ],
        quiz: {
          question: 'Сколько цифровых пинов у Arduino UNO?',
          options: ['6', '10', '14', '20'],
          correct: 2,
          explanation: 'Arduino UNO имеет 14 цифровых пинов (0–13). Аналоговых — 6 (A0–A5).'
        }
      }
    ]
  },
  {
    id: 'led',
    name: 'Светодиоды',
    icon: 'lightbulb',
    num: '02',
    lessons: [
      {
        id: 'l2',
        title: 'Светодиод — Гори!',
        duration: '10 мин',
        sections: [
          {
            type: 'text',
            content: 'Первый проект — заставить светодиод мигать. Это «Hello, World» мира электроники.'
          },
          {
            type: 'components',
            items: [
              { icon: 'developer_board', name: 'Arduino UNO', qty: '1 шт.' },
              { icon: 'grid_on', name: 'Макетная плата', qty: '1 шт.' },
              { icon: 'cable', name: 'Провода папа-папа', qty: '2 шт.' },
              { icon: 'circle', name: 'Светодиод', qty: '1 шт.' },
              { icon: 'horizontal_rule', name: 'Резистор 220 Ом', qty: '1 шт.' },
              { icon: 'usb', name: 'USB кабель', qty: '1 шт.' }
            ]
          },
          {
            type: 'info',
            title: 'Зачем резистор?',
            text: 'Резистор ограничивает ток. Без него светодиод сгорит за секунды. Всегда используй 220 Ом.'
          },
          {
            type: 'code',
            code: 'void setup() {\n  pinMode(10, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(10, HIGH); // 5В — горит\n  delay(100);\n  digitalWrite(10, LOW);  // 0В — гаснет\n  delay(900);\n  // итого: мигает раз в секунду\n}'
          },
          {
            type: 'builder',
            title: 'Задание в конструкторе',
            task: 'Собери схему: Arduino UNO → резистор 220Ом → красный светодиод → GND. Подключи резистор к пину D10. Напиши код, который мигает светодиодом раз в секунду (100мс горит, 900мс выключен).',
            hint: 'Не забудь резистор! Без него светодиод сгорит.',
            components: ['Arduino UNO', 'Резистор 220Ω', 'LED Красный']
          }
        ],
        quiz: {
          question: 'Какая функция настраивает режим пина?',
          options: ['digitalWrite()', 'pinMode()', 'delay()', 'analogRead()'],
          correct: 1,
          explanation: 'pinMode(пин, режим) — устанавливает пин как INPUT или OUTPUT. Вызывается один раз в setup().'
        }
      },
      {
        id: 'l3',
        title: 'Нарастающая яркость (ШИМ)',
        duration: '10 мин',
        sections: [
          {
            type: 'info',
            title: 'Что такое ШИМ?',
            text: 'ШИМ — широтно-импульсная модуляция. Имитирует аналоговый сигнал на цифровом выходе. Обозначается знаком «~» на плате.'
          },
          {
            type: 'text',
            content: 'analogWrite() принимает значения от <strong>0</strong> (выключен) до <strong>255</strong> (полная яркость).<br><br>ШИМ-пины Arduino UNO: <strong>3, 5, 6, 9, 10, 11</strong>'
          },
          {
            type: 'components',
            items: [
              { icon: 'developer_board', name: 'Arduino UNO', qty: '1 шт.' },
              { icon: 'grid_on', name: 'Макетная плата', qty: '1 шт.' },
              { icon: 'cable', name: 'Провода папа-папа', qty: '2 шт.' },
              { icon: 'circle', name: 'Светодиод', qty: '1 шт.' },
              { icon: 'horizontal_rule', name: 'Резистор 220 Ом', qty: '1 шт.' }
            ]
          },
          {
            type: 'code',
            code: '#define LED_PIN 9\n\nvoid setup() {\n  pinMode(LED_PIN, OUTPUT);\n}\n\nvoid loop() {\n  analogWrite(LED_PIN, 85);  // 1/3 яркости\n  delay(250);\n  analogWrite(LED_PIN, 170); // 2/3 яркости\n  delay(250);\n  analogWrite(LED_PIN, 255); // полный накал\n  delay(250);\n}'
          },
          {
            type: 'builder',
            title: 'Практика: плавная яркость',
            task: 'Собери схему: Arduino D9 (ШИМ~) → резистор 220Ом → зелёный светодиод → GND. Напиши код с тремя уровнями яркости (85, 170, 255) через analogWrite. Каждый уровень держи 250мс.',
            hint: 'Используй пин D9, D10 или D11 — они помечены знаком ~ (ШИМ).',
            components: ['Arduino UNO', 'Резистор 220Ω', 'LED Зелёный']
          }
        ],
        quiz: {
          question: 'Максимальное значение analogWrite()?',
          options: ['100', '127', '255', '1023'],
          correct: 2,
          explanation: 'analogWrite() работает с диапазоном 0–255. 0 = 0В, 255 = 5В, 127 ≈ 2.5В.'
        }
      }
    ]
  },
  {
    id: 'sensors',
    name: 'Датчики',
    icon: 'sensors',
    num: '03',
    lessons: [
      {
        id: 'l4',
        title: 'Виды датчиков',
        duration: '7 мин',
        sections: [
          {
            type: 'text',
            content: '<strong>Датчики</strong> — дополнительный функционал Arduino. Делятся на два типа: ввод и вывод.'
          },
          {
            type: 'info',
            title: 'Датчики ввода',
            text: 'Собирают данные из среды:\n— Датчик влажности почвы\n— Клавиатура 4×4\n— Датчик звука\n— Джойстик\n— DHT11 (температура/влажность)\n— Датчик CO₂'
          },
          {
            type: 'info',
            title: 'Датчики вывода',
            text: 'Выполняют команды Arduino:\n— Пьезоэлемент\n— Сервоприводы\n— Дисплеи\n— LED-матрицы'
          }
        ],
        quiz: {
          question: 'Какой из датчиков является датчиком ВВОДА?',
          options: ['Пьезоэлемент', 'Джойстик', 'Сервопривод', 'LED-матрица'],
          correct: 1,
          explanation: 'Джойстик считывает движение и передаёт данные в Arduino — это ввод. Остальные — устройства вывода.'
        }
      }
    ]
  },
  {
    id: 'sound',
    name: 'Звук',
    icon: 'volume_up',
    num: '04',
    lessons: [
      {
        id: 'l5',
        title: 'Пьезопищалка',
        duration: '10 мин',
        sections: [
          {
            type: 'text',
            content: '<strong>Пьезоэлемент</strong> — простой динамик. Чем выше частота (Гц), тем выше тон звука.'
          },
          {
            type: 'components',
            items: [
              { icon: 'developer_board', name: 'Arduino UNO', qty: '1 шт.' },
              { icon: 'grid_on', name: 'Макетная плата', qty: '1 шт.' },
              { icon: 'cable', name: 'Провода папа-папа', qty: '3 шт.' },
              { icon: 'notifications', name: 'Пьезоэлемент', qty: '1 шт.' }
            ]
          },
          {
            type: 'code',
            code: 'void setup() {\n  pinMode(10, OUTPUT);\n}\n\nvoid loop() {\n  tone(10, 600);  // 600 Гц\n  delay(1000);\n  tone(10, 900);  // 900 Гц\n  delay(1000);\n  noTone(10);     // тишина\n  delay(1000);\n}'
          },
          {
            type: 'builder',
            title: 'Практика: два тона',
            task: 'Подключи пьезопищалку к пину D10 (+ пин) и GND (− пин). Напиши код, который воспроизводит поочерёдно 600 Гц и 900 Гц по 1 секунде, затем тишину 1 секунду.',
            hint: 'Функция tone(pin, freq) — запускает звук. noTone(pin) — останавливает.',
            components: ['Arduino UNO', 'Пьезопищалка']
          },
          {
            type: 'info',
            title: 'Ноты',
            text: 'До=262, Ре=294, Ми=330, Фа=349, Соль=392, Ля=440, Си=494 Гц'
          }
        ],
        quiz: {
          question: 'Какая функция воспроизводит звук?',
          options: ['playSound()', 'beep()', 'tone()', 'sound()'],
          correct: 2,
          explanation: 'tone(pin, frequency) — встроенная функция. noTone(pin) — остановка звука.'
        }
      },
      {
        id: 'l6',
        title: 'Терменвокс',
        duration: '15 мин',
        sections: [
          {
            type: 'text',
            content: '<strong>Терменвокс</strong> — музыкальный инструмент, управляемый движением рук. Сделаем аналог с фоторезистором.'
          },
          {
            type: 'info',
            title: 'Фоторезистор',
            text: 'Меняет сопротивление в зависимости от освещения. Закрываешь рукой — меняется тон звука.'
          },
          {
            type: 'components',
            items: [
              { icon: 'developer_board', name: 'Arduino UNO', qty: '1 шт.' },
              { icon: 'grid_on', name: 'Макетная плата', qty: '1 шт.' },
              { icon: 'cable', name: 'Провода папа-папа', qty: '6 шт.' },
              { icon: 'notifications', name: 'Пьезоэлемент', qty: '1 шт.' },
              { icon: 'light_mode', name: 'Фоторезистор', qty: '1 шт.' },
              { icon: 'horizontal_rule', name: 'Резистор 10 кОм', qty: '1 шт.' }
            ]
          },
          {
            type: 'code',
            code: '#define BUZZER 8\n#define PHOTO  A0\n\nvoid setup() {\n  pinMode(BUZZER, OUTPUT);\n}\n\nvoid loop() {\n  int light = analogRead(PHOTO);\n  int freq = map(light, 0, 1023, 100, 2000);\n  if (light < 900) {\n    tone(BUZZER, freq);\n  } else {\n    noTone(BUZZER);\n  }\n}'
          }
        ],
        quiz: {
          question: 'Что делает map()?',
          options: [
            'Рисует карту',
            'Преобразует значение из одного диапазона в другой',
            'Считывает карту памяти',
            'Создаёт массив'
          ],
          correct: 1,
          explanation: 'map(value, fromLow, fromHigh, toLow, toHigh) — перемасштабирует число. Например, map(512, 0, 1023, 0, 255) → 127.'
        }
      }
    ]
  }
];