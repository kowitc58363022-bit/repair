// Inspection forms: the paper sheets in this folder as data (see INSPECTION_FORMS_SPEC_TH.md).
// One copy, used by Inspection/index.html and by the PM plan page (it picks the form and round for a PM job): change it here only.
// window.INSP = { FORMS, FIGS, inRule }
(function () {
  const it = (id, type, label, o = {}) => ({ id, type, label, ...o });
  const val = (id, label, min, max, unit, tool, o = {}) => it(id, 'value', label, { min, max, unit, tool, ...o });
  const vib = (id, p, o = {}) => it(id, 'value', `วัดความสั่นสะเทือน จุดที่ ${p}`, { unit: 'mm/s', judge: 'iso', tool: 'Vibration meter', ref: 'iso', fig: 'fan', ...o });
  // slash: the sheet has one after-work cell written as "R / S / T"; the app shows and prints the phases that way
  const v3 = (id, o = {}) => it(id, 'v3', 'แรงดันไฟฟ้า 3 เฟส 400V หรือ 1 เฟส 230V', { tol: 10, ba: 'after', tool: 'Multi meter', ...o });
  const i3 = (id, label = 'กระแสไฟฟ้าขณะเครื่องทำงาน', o = {}) => it(id, 'i3', label, { ba: 'after', spec: '≤ 115% ของ RLA', tool: 'Multi meter', ...o });
  const ins = (id, label = 'ความเป็นฉนวนของขดลวด Motor (DC 500 V)') => it(id, 'ins', label, { spec: '> 0.5 MΩ', tool: 'Mega-Ohm meter' });
  const belt = (id, n = 3) => it(id, 'belt', 'ความตึงสายพาน (ถ้ามี)', { n, spec: 'ตารางมาตรฐาน 2', tool: 'Belt tester', ref: 'belt' });
  const vt = (id, n, label, fig) => it(id, 'vibTemp', label, { n, tool: 'Vibration / Thermo meter', ref: 'iso', fig });

  // Diagrams cropped from the paper sheets (img/), shown beside the items that need them
  const FIGS = {
    fan:       { src: 'img/fan_points.png',   cap: 'ตำแหน่งจุดวัดความสั่น 1–4 (ซ้าย: ขับสายพาน · ขวา: ต่อตรง)' },
    // ar = image width / height; pts = numbered boxes on the picture [centre x, centre y, width, height] as fractions,
    // lit red while that point's readings are being typed
    bp:        { src: 'img/bp_points.png',    cap: 'ตำแหน่งจุดวัด 1–3 ของชุดเกียร์และมอเตอร์', ar: 1102 / 794,
                 pts: { 1: [0.117, 0.548, 0.089, 0.083], 2: [0.355, 0.539, 0.087, 0.083], 3: [0.860, 0.605, 0.087, 0.083] } },
    vp:        { src: 'img/vp_points.png',    cap: 'ตำแหน่งจุดวัด 1–4 ตามแบบปั๊ม CT3 / CT4 / FT3' },
    wp:        { src: 'img/wp_points.png',    cap: 'ตำแหน่งจุดวัด 1–3 ตามแบบปั๊ม (แนวตั้ง / แนวนอน)' },
    wpAlign:   { src: 'img/wp_alignment.png', cap: 'วิธีวัด Alignment: ระยะห่างหน้าคัปปลิ้ง (ซ้าย) และเยื้องศูนย์ (ขวา)' },
    hexRods:   { src: 'img/hex_rods.png',     cap: 'จุดวัดระยะเหล็กสตัดเกลียว D1–D8' },
    hexPlates: { src: 'img/hex_plates.png',   cap: 'รูปแบบการจัดเรียงแผ่นเพลท' },
    cfp:       { src: 'img/cfp_piping.png',   cap: 'ระบบท่อ จุด Injection point และชิ้นส่วนหัวปั๊ม' },
  };
  const tasks = (list) => list.map((label, i) => ({ id: `2.${i + 1}`, label }));

  const FAN_TASKS = ['วัดค่าการทำงานของเครื่อง ตามข้อ 1', '5ส บริเวณเครื่อง', 'ตรวจสอบเสียงผิดปกติของมอเตอร์, สายพาน, ชุดใบพัด', 'เช็ด-ดูดฝุ่น ทำความสะอาดภายในตัวตู้ Filter, chamber', 'เช็ดทำความสะอาด Cover สายพาน (ถ้ามี)', 'ปรับตั้งสายพาน / Alignment ให้เป็นไปตามมาตรฐาน (ถ้ามี)', 'อัดจารบี เบอร์ LGMT 3/5 หรือ LGMT 2/5 (ถ้ามี)', 'ขันสกรูตัวหนอน, น็อตยึดทุกจุด', 'ล้างทำความสะอาดใบพัดลม (Blower cleaning)', 'เปลี่ยนสายพาน (ถ้ามี)'];

  const FORMS = [
    { id: 'EF', kind: 'pm', code: 'CE97F1029', name: 'Exhaust Fan', th: 'พัดลมดูด · Process Exhaust Fan',
      subtypes: ['EF', 'PEF'], models: ['Bearing Blower', 'Bearing Motor', 'Blower', 'Motor'], panel: true, periods: ['1M', '3M', '1Y'],
      m: [val('1.1', 'ความเร็วลมในท่อส่ง-จ่ายลม', 3, null, 'm/s', 'Air flow meter', { spec: '> 3 m/s หรือ m/c std.' }),
          vib('1.2', 1), vib('1.3', 2), vib('1.4', 3), vib('1.5', 4), v3('1.6', { rn: true }), i3('1.7'), belt('1.8'), ins('1.9')],
      t: tasks(FAN_TASKS),
      rules: { '1M': ['1.6', '1.7', '2.1-2.5'], '3M': ['1.1-1.8', '2.1-2.8'], '1Y': 'all', repair: ['1.1-1.10'] } },

    { id: 'SF', kind: 'pm', code: 'CE97F1029', name: 'Supply Fan / FFU', th: 'พัดลมจ่ายลม · Fan Filter Unit',
      subtypes: ['SF', 'FFU'], models: ['Blower', 'Motor'], panel: true, periods: ['1M', '3M', '1Y'],
      m: [val('1.1', 'ความเร็วลมในท่อส่ง-จ่ายลม', 3, null, 'm/s', 'Air flow meter', { spec: '> 3 m/s หรือ m/c std.', only: 'SF' }),
          val('1.2', 'ความเร็วลมหัวจ่าย / ดูด (grille)', 3, null, 'm/s', 'Air flow meter', { spec: '> 3 m/s หรือ m/c std.', only: 'FFU' }),
          vib('1.3', 1, { only: 'SF' }), vib('1.4', 2, { only: 'SF' }), vib('1.5', 3, { only: 'SF' }), vib('1.6', 4, { only: 'SF' }),
          v3('1.7', { rn: true }), i3('1.8'), belt('1.9'), ins('1.10')],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', 'เปลี่ยนแผ่นกรองอากาศ Pre-Filter / เช็ค Diff. เกจ', '5ส บริเวณเครื่อง', 'ตรวจสอบเสียงผิดปกติของมอเตอร์, สายพาน, ชุดใบพัด', 'เช็ด-ดูดฝุ่น ทำความสะอาดภายในตัวตู้ Filter, chamber', 'เช็ดทำความสะอาด Cover สายพาน (ถ้ามี)', 'ปรับตั้งสายพาน / Alignment ให้เป็นไปตามมาตรฐาน (ถ้ามี)', 'อัดจารบี เบอร์ LGMT 3/5 หรือ LGMT 2/5 (ถ้ามี)', 'ขันสกรูตัวหนอน, น็อตยึดทุกจุด', 'ล้างทำความสะอาดใบพัดลม (Blower cleaning)', 'เปลี่ยนแผ่นกรองอากาศ Medium Filter (ถ้ามี)', 'เปลี่ยนแผ่นกรองอากาศ HEPA Filter (ถ้ามี)', 'เปลี่ยนสายพาน (ถ้ามี)']),
      rules: { '1M': ['1.7', '1.8', '2.1-2.6'], '3M': ['1.1-1.9', '2.1-2.8'], '1Y': 'all', repair: ['1.1-1.10'] } },

    { id: 'VF', kind: 'pm', code: 'CE97F1029', name: 'Ventilation Fan', th: 'พัดลมระบายอากาศ',
      subtypes: ['VF'], models: ['Blower', 'Motor'], panel: true, periods: ['1M', '3M', '6M', '1Y'],
      m: [val('1.1', 'ความเร็วลมที่ Grille ด้านดูด', 3, null, 'm/s', 'Air flow meter', { spec: '> 3 m/s หรือ m/c std.' }),
          vib('1.2', 1), vib('1.3', 2), vib('1.4', 3), vib('1.5', 4), v3('1.6', { rn: true }), i3('1.7'), belt('1.8'), ins('1.9')],
      t: tasks(FAN_TASKS),
      rules: { '1M': ['1.6', '1.7', '2.1-2.5'], '3M': ['1.1-1.8', '2.1-2.8'], '6M': 'all', '1Y': 'all', repair: ['1.1-1.10'] } },

    { id: 'AHU', kind: 'pm', code: 'CE97F1009L', name: 'Air Handling Unit', th: 'OAHU · AHU · FCU · OAC',
      subtypes: ['OAHU', 'AHU', 'FCU', 'OAC'], models: ['Blower', 'Motor'], panel: true, periods: ['1M', '3M', '6M', '1Y'],
      m: [val('1.1', 'อุณหภูมิลมจ่าย (Supply)', 8, 15, '°C', 'Thermo meter'),
          val('1.2', 'ความชื้นลมจ่าย (Supply)', 60, 95, '%RH', 'Thermo meter'),
          val('1.3', 'อุณหภูมิลมกลับ (Room)', 24, 28, '°C', 'Thermo meter'),
          val('1.4', 'ความชื้นลมกลับ (Room)', 40, 80, '%RH', 'Thermo meter'),
          val('1.5', 'อุณหภูมิน้ำเย็นด้านเข้า', 5, 8, '°C', 'Thermo meter'),
          val('1.6', 'อุณหภูมิน้ำเย็นด้านออก', 9, 12, '°C', 'Thermo meter'),
          val('1.7', 'แรงดันน้ำเย็นด้านเข้า', 3.0, 6.0, 'kg/cm²', 'Pressure gauge', { ba: 'after' }),
          val('1.8', 'แรงดันน้ำเย็นด้านออก', 2.5, 5.5, 'kg/cm²', 'Pressure gauge', { ba: 'after' }),
          v3('1.9', { rn: true }), i3('1.10'),
          ins('1.11', 'ความเป็นฉนวนขดลวด Motor No.1'), ins('1.12', 'ความเป็นฉนวนขดลวด Motor No.2'),
          belt('1.13'),
          it('1.14', 'grid', 'ความเร็วลมหน้าแผงคอยล์น้ำเย็น (Fan coil)', { min: 2.8, max: 3.5, unit: 'm/s', tool: 'Flow meter' })],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', 'เปลี่ยนแผ่นกรองอากาศ Pre-Filter', 'เปลี่ยนแผ่นกรองอากาศ Medium Filter', 'เปลี่ยนแผ่นกรองอากาศ HEPA Filter', 'ทำความสะอาดท่อเดรน / ถาดเดรน', 'เช็ดทำความสะอาดภายในตัวตู้ OAC / AHU / FCU', 'ตรวจเช็คหลอดไฟ-ระบบส่องสว่างภายในตู้', 'ตรวจเช็คสภาพการทำงานของเกจ Diff. Pressure', 'ตรวจเช็คสภาพการทำงานของเกจวัดแรงดันน้ำเย็น เข้า-ออก', 'ปรับตั้งสายพาน ให้เป็นไปตามมาตรฐาน (ถ้ามี)', 'อัดจารบี (ถ้ามี)', 'ตรวจสอบระบบระบายน้ำของ AHU โดยการเทน้ำ', 'ทดสอบชุดควบคุมอุณหภูมิ AZBIL/YAMATAKE (AUTO/MANUAL)', 'ทดสอบวัด Dew point sensor ตาม Setting (Error ±1 °C)', 'ทดสอบวัด Temp sensor ตาม Setting', 'ทดสอบวัด Humidity sensor ตาม Setting', 'ทดสอบวัดปริมาณลมในท่อได้ CMH ตาม Design', 'ล้างแผงคอยล์น้ำเย็น (Fan coil)']),
      rules: { '1M': ['1.1-1.10', '2.1', '2.2', '2.5-2.9'], '3M': ['1.1-1.10', '2.1', '2.2', '2.5-2.12'], '6M': 'all', '1Y': 'all', repair: ['1.1-1.9'] } },

    { id: 'PCAC', kind: 'pm', code: 'CE97F1002K', name: 'Air Condition Unit', th: 'เครื่องปรับอากาศ AC · PC',
      subtypes: ['AC', 'PC'], models: ['CDU', 'FCU'], panel: true, periods: ['1M', '3M', '6M', '1Y'], refr: true,
      note1M: 'รอบ 1M เฉพาะ Canteen 1, 2',
      m: [val('1.1', 'FCU อุณหภูมิลมจ่าย (Supply)', 8, 12, '°C', 'Thermo meter'),
          val('1.2', 'FCU อุณหภูมิลมกลับ (Room)', 16, 28, '°C', 'Thermo meter'),
          it('1.3', 'value', 'อุณหภูมิท่อน้ำยาด้านดูด', { unit: '°C', judge: 'refT', tool: 'Thermo meter', ref: 'refr' }),
          i3('1.4', 'กระแส Compressor No.1', { ba: 'both' }),
          i3('1.5', 'กระแส Compressor No.2', { ba: 'both' }),
          v3('1.6', { ba: 'both' }),
          it('1.7', 'pair', 'ผลต่างอุณหภูมิ เข้า-ออก ดรายเออร์ฟิวเตอร์ (ถ้ามี)', { labels: ['Comp.1', 'Comp.2'], max: 5, unit: '°C', spec: '< 5 °C', tool: 'Thermo meter' }),
          it('1.8', 'pair', 'ผลต่างอุณหภูมิอากาศ เข้า-ออก Condensing unit', { labels: ['CDU1', 'CDU2'], min: 12, max: 18, unit: '°C', spec: '15 ± 3 °C', tool: 'Thermo meter' }),
          it('1.9', 'refr', 'ความดันน้ำยา Compressor No.1', { tool: 'Manifold gauge', ref: 'refr' }),
          it('1.10', 'refr', 'ความดันน้ำยา Compressor No.2', { tool: 'Manifold gauge', ref: 'refr' }),
          ins('1.11', 'ความเป็นฉนวนขดลวด Compressor No.1'), ins('1.12', 'ความเป็นฉนวนขดลวด Compressor No.2'),
          belt('1.13', 2),
          it('1.14', 'grid', 'ความเร็วลมด้านกลับ', { min: 2.8, max: 3.5, unit: 'm/s', tool: 'Flow meter' })],
      t: tasks(['วัดค่าการทำงานของเครื่องปรับอากาศ ตามข้อ 1', 'เปลี่ยน Pre-Filter หน้าแอร์ PC', 'ล้างทำความสะอาดแผงคอยล์เย็นและแผ่นกรองอากาศ FCU', 'ทำความสะอาดท่อเดรน / ถาดเดรน FCU', 'เช็ดทำความสะอาดหัว Probe วัดอุณหภูมิ FCU', 'ขันน็อตจุดต่อสายไฟชุดแผงวงจรไฟฟ้าและมาร์คสี FCU+CDU', 'เป่าทำความสะอาดแผงวงจรไฟฟ้า FCU+CDU', 'ล้างทำความสะอาดแผงคอยล์ร้อน CDU', 'ตรวจเช็คการตันของดรายเออร์ฟิวเตอร์', 'ตรวจเช็ค Fan Capacitor, Compressor Capacitor (ถ้ามี)', 'ปรับตั้งสายพาน ให้เป็นไปตามมาตรฐาน (ถ้ามี)', 'เปลี่ยนสายพาน ให้เป็นไปตามมาตรฐาน (ถ้ามี)', 'ตรวจสอบความเรียบร้อยโดยรวมของเครื่องจักรเพื่อความพร้อมต่อการใช้งาน', 'ตรวจสอบระบบระบายน้ำโดยการเทน้ำ รวมถึงถาดเดรนแอร์และ Heater', 'ตรวจสอบฉนวนของเครื่องและท่อดักท์', 'ล้างทำความสะอาด net filter (ถ้ามี)']),
      rules: { '1M': ['1.1-1.8', '2.16'], '3M': ['1.1-1.8', '1.13', '2.1', '2.3-2.4', '2.6-2.15'], '6M': ['1.1-1.14', '2.1-2.11', '2.13-2.16'], '1Y': 'all', repair: ['1.1-1.12'] } },

    { id: 'BP', kind: 'pm', code: 'CE97F1012H', name: 'Blower Pump', th: 'ปั๊มลม Blower',
      subtypes: ['MX', 'Other'], models: ['Pump'], panel: true, periods: ['3M', '1Y'],
      m: [v3('1.1', { slash: true }), i3('1.2', undefined, { slash: true }), ins('1.3'),
          vt('1.4', 3, 'ความสั่นสะเทือน / ความร้อน ชุดเกียร์และมอเตอร์', 'bp')],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', 'ตรวจสอบการรั่วของน้ำมันเกียร์ และเปลี่ยนแผ่น Filter', 'อัดจารบี / ตรวจเช็คและเติมน้ำมันเกียร์ (ถ้ามี)', 'ตรวจสอบเสียงผิดปกติชุดเกียร์, มอเตอร์', 'เปลี่ยนชิ้นส่วนหลัก Bearing, Seal, Gasket, O-ring', 'ขัดล้างทำความสะอาดภายใน, พ่นสีเคลือบเกียร์, พ่นสีภายนอก', 'เปลี่ยน Bearing motor, เคลือบน้ำยา Varnish, อบขดลวดมอเตอร์']),
      rules: { '3M': ['1.1', '1.2', '1.4', '2.1-2.4'], '1Y': 'all', repair: 'all' } },

    { id: 'CFP', kind: 'pm', code: 'CE97F1012H', name: 'Chemical Feed Pump', th: 'ปั๊มจ่ายสารเคมี',
      subtypes: ['CHP', 'CP', 'WP', 'Other'], models: ['Pump'], panel: true, periods: ['3M'],
      m: [v3('1.1', { slash: true }), i3('1.2', undefined, { slash: true }), ins('1.3'),
          it('1.4', 'dosing', 'อัตราการไหลของน้ำยา ที่จุด Injection point', { tool: 'บีกเกอร์ + นาฬิกาจับเวลา', fig: 'cfp' })],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', 'ตรวจสอบการรั่วของน้ำยา, สาย, ท่อ, ตัวปั๊ม', 'ล้างทำความสะอาด Foot valve', 'ล้างทำความสะอาด Ball check valve ด้าน Suction', 'ล้างทำความสะอาด Ball check valve ด้าน Discharge', 'ล้างทำความสะอาด หัวฉีดน้ำยา (Injection point)']),
      rules: { '3M': 'all', repair: 'all' } },

    { id: 'HEX', kind: 'pm', code: 'CE97F1029', name: 'Heat Exchanger', th: 'เครื่องแลกเปลี่ยนความร้อน',
      subtypes: ['HEX'], models: ['Model'], panel: false, periods: ['3M'],
      m: [val('1.1', 'อุณหภูมิน้ำเข้า Chiller → HEX', 5, 8, '°C', 'Thermo meter'),
          val('1.2', 'อุณหภูมิน้ำออก HEX → Chiller', 9, 13, '°C', 'Thermo meter'),
          val('1.3', 'อุณหภูมิน้ำเข้า Process → HEX', 20, 35, '°C', 'Thermo meter'),
          val('1.4', 'อุณหภูมิน้ำออก HEX → Process', 10, 25, '°C', 'Thermo meter', { spec: '10 – 25 °C หรือ m/c std.' }),
          val('1.5', 'แรงดันน้ำเข้า Chiller → HEX', 3.0, 6.0, 'kg/cm²', 'Pressure gauge'),
          val('1.6', 'แรงดันน้ำออก HEX → Chiller', 2.5, 5.5, 'kg/cm²', 'Pressure gauge'),
          val('1.7', 'แรงดันน้ำเข้า Process → HEX', 3.0, 6.0, 'kg/cm²', 'Pressure gauge'),
          val('1.8', 'แรงดันน้ำออก HEX → Process', 2.5, 5.5, 'kg/cm²', 'Pressure gauge'),
          ...[1, 2, 3, 4, 5, 6, 7, 8].map(d => val(`1.${8 + d}`, `ระยะเหล็กสตัดเกลียว D${d}`, null, null, 'mm', 'Meter tape', { spec: 'ขึ้นอยู่กับหน้างาน', fig: 'hexRods' })),
          it('1.17', 'choice', 'รูปแบบการจัดเรียงแผ่นเพลท', { options: ['Multi-pass', 'Single-pass'], fig: 'hexPlates' })],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', 'ถอดแผ่นเพลทพร้อมทำเขียนระบุหมายเลขแผ่น', 'ล้างแผ่นเพลท (Plate cleaning)', 'Circulate น้ำในท่อด้านเข้า-ออก, ล้างระบบท่อ', 'ล้างทำความสะอาดถังรับน้ำ CST, WST', 'ล้างทำความสะอาดเช็ควาล์ว (Check valve) ของปั๊มน้ำ', 'ล้างทำความสะอาด Y-Strainer ของปั๊มน้ำ', 'ตรวจสอบการประกอบแผ่นเพลทตามหมายเลขตามข้อ 2.2', 'ประกอบระยะสตัดตามข้อ 1.9 – 1.16', 'เปิดปั๊มน้ำเข้าระบบและตรวจสอบจุดรั่ว', 'หุ้มฉนวนของ Heat exchanger']),
      rules: { '3M': 'all', repair: ['1.1-1.8'] } },

    { id: 'VP', kind: 'pm', code: 'CE97F1006J', name: 'Vacuum Pump', th: 'ปั๊มสุญญากาศ · High Vacuum',
      subtypes: ['VP'], models: ['Pump', 'Motor'], panel: true, periods: ['1M', '1Y'], vpModel: true,
      m: [v3('1.1', { rn: true }), i3('1.2'),
          val('1.3', 'อุณหภูมิน้ำขาเข้าปั๊ม', null, 30, '°C', 'Thermo meter', { spec: '< 30 °C' }),
          val('1.4', 'แรงดันน้ำขาเข้าปั๊ม', 2.0, 5.5, 'kg/cm²', 'Pressure gauge'),
          it('1.5', 'value', 'อัตราการไหลของน้ำเข้าปั๊ม', { unit: 'l/min', judge: 'vpflow', tool: 'Flow meter', ref: 'vpflow' }),
          val('1.6', 'Unload test (ปิดวาล์วด้านดูด 5 วินาที)', -760, -740, 'mmHg', 'Vacuum gauge', { neg: true }),
          ins('1.7'),
          vt('1.8', 4, 'ความสั่นสะเทือน / ความร้อน ปั๊มและมอเตอร์', 'vp')],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', '5ส บริเวณเครื่อง', 'ตรวจเช็คการรั่วของน้ำจากปั๊มสุญญากาศ', 'ตรวจสอบสภาพเกจวัดแรงดูด (vacuum gauge)', 'ทำความสะอาด Y-Strainer ของท่อด้านดูด', 'ทำความสะอาด Flow meter น้ำ', 'เปลี่ยนสายพาน, ตรวจสอบร่อง Pulley และปรับตั้ง Alignment', 'เก็บตัวอย่างน้ำมันเพื่อวิเคราะห์ (เขียนระบุหมายเลขเครื่อง)', 'ตรวจสอบระดับน้ำมันและเติมน้ำมัน ประมาณ ½ ของ Sight glass', 'เปลี่ยนชิ้นส่วนหลัก Bearing, Seal, Gasket, O-ring, Gear', 'ขัดล้างทำความสะอาดภายใน, พ่นสีเคลือบใบพัด, พ่นสีภายนอก', 'เปลี่ยน Bearing motor, เคลือบน้ำยา Varnish, อบขดลวดมอเตอร์']),
      rules: { '1M': ['1.1-1.6', '2.1-2.9'], '1Y': 'all', repair: 'all' } },

    { id: 'WP', kind: 'pm', code: 'CE97F1012H', name: 'Water Pump', th: 'ปั๊มน้ำ',
      subtypes: ['CP', 'CWP', 'WP', 'Other'], models: ['Pump', 'Motor'], panel: true, periods: ['3M', '1Y'], pumpState: true,
      m: [v3('1.1', { tol: 5, slash: true, note: 'วัดหลังแมกเนติกคอนแทคเตอร์' }), i3('1.2', undefined, { slash: true }),
          val('1.3', 'แรงดันน้ำขาเข้าปั๊ม ขณะทำงาน', 2.0, 6.5, 'kg/cm²', 'Pressure gauge'),
          val('1.4', 'Unload test (ปิดวาล์ว Discharge 5 วินาที)', 3.0, 6.5, 'kg/cm²', 'Pressure gauge'),
          ins('1.5'),
          vt('1.6', 3, 'ความสั่นสะเทือน / ความร้อน ปั๊มและมอเตอร์', 'wp'),
          it('1.7', 'align', 'ปรับตั้งศูนย์ Alignment', { tool: 'Dial gauge / Feeler gauge', fig: 'wpAlign' }),
          it('1.8', 'vunb', 'แรงดันเฉลี่ยและแรงดันไม่สมดุล (จากข้อ 1.1)', { from: '1.1' })],
      t: tasks(['วัดค่าการทำงานของเครื่อง ตามข้อ 1', '5ส บริเวณเครื่อง', 'ตรวจเช็คการรั่วของน้ำจากปั๊ม (Grand packing : 3-5 หยด/นาที)', 'ตรวจสอบสภาพเกจวัดแรงดัน (pressure gauge)', 'ทำความสะอาด Y-Strainer / Check valve', 'ล้างทำความสะอาด Foot valve (ถ้ามี)', 'ตรวจสอบสภาพของลูกยาง และปรับตั้งศูนย์ (Alignment) (ถ้ามี)', 'เปลี่ยนชิ้นส่วนหลัก Bearing, Seal, Gasket, O-ring', 'ขัดล้างทำความสะอาดภายใน, พ่นสีเคลือบใบพัด, พ่นสีภายนอก', 'เปลี่ยน Bearing motor, เคลือบน้ำยา Varnish, อบขดลวดมอเตอร์']),
      rules: { '3M': ['1.1-1.4', '1.6-1.8', '2.1-2.7'], '1Y': 'all', repair: 'all' } },

    // ---------- Daily logs (one entry = one machine, one day) ----------
    { id: 'CT', kind: 'daily', code: 'CE97F1005Q', name: 'Cooling Tower', th: 'ตรวจรายวัน',
      m: [it('d1', 'ok', 'Scale in cooling tower', { spec: 'สะอาดและไม่มีตะกรัน' }),
          it('d2', 'ok', 'ระดับน้ำต่ำกว่า Overflow', { spec: '0.5 – 1 cm' }),
          it('d3', 'ok', 'Water spray', { spec: 'ทุกรูของ Sprinkler pipe ต้องมีน้ำออก' }),
          it('d4', 'ok', 'Sprinkler head', { spec: 'ไม่รั่ว ไม่หลวม' }),
          it('d5', 'ok', 'Moving of sprinkler', { spec: 'หมุนปกติ' }),
          it('d6', 'ok', 'Around cooling tower', { spec: 'ไม่มีรอยแตก' }),
          it('d7', 'ok', 'Water tray', { spec: 'ไม่มีน้ำเลอะรอบถาด' }),
          it('d8', 'ok', 'Inlet louver', { spec: 'ไม่แตก ไม่หลวม' }),
          it('d9', 'ok', 'PVC filling', { spec: 'สะอาด ไม่แตก ไม่หลวม' }),
          val('d10', 'Water inlet temp.', null, 40, '°C', '', { ba: 'after', spec: 'ไม่เกิน 40 °C' }),
          it('d11', 'ok', 'Water level in underground tank', { spec: 'น้ำต้องสัมผัสลูกลอย' }),
          val('d12', 'ค่าน้ำ IW', 200, 400, 'µS/cm', '', { ba: 'after' })] },

    { id: 'ACP', kind: 'daily', code: 'CE97F1005Q', name: 'Air Compressor', th: 'ตรวจรายวัน',
      m: [val('d1', 'Oil pressure', 2.0, 3.0, 'kg/cm²', '', { ba: 'after' }),
          val('d2', '1st discharge pressure', 1.5, null, 'kg/cm²', '', { ba: 'after' }),
          val('d3', '2nd discharge pressure', null, 6.9, 'kg/cm²', '', { ba: 'after' }),
          val('d4', 'Motor current', null, null, 'A', '', { ba: 'after', spec: 'จดค่าไว้' }),
          val('d5', 'Oil temp.', null, 60, '°C', '', { ba: 'after', spec: '< 60 °C' }),
          val('d6', '1st discharge temp.', null, 180, '°C', '', { ba: 'after' }),
          val('d7', '2nd suction temp.', null, 55, '°C', '', { ba: 'after' }),
          val('d8', '2nd discharge temp.', null, 180, '°C', '', { ba: 'after' }),
          val('d9', '1st suction pressure', -45, null, 'kg/cm²', '', { ba: 'after', neg: true, spec: 'ไม่ต่ำกว่า -45 (ตามฟอร์ม)' }),
          val('d10', '1st suction temp.', null, 55, '°C', '', { ba: 'after' }),
          val('d11', 'Running hour', null, null, 'hr', '', { ba: 'after', spec: 'ชั่วโมงทำงานสะสม' }),
          it('d12', 'ok', 'Drain solenoid valve'),
          it('d13', 'ok', 'Lubricate oil level', { spec: 'อยู่ช่วง H – L' }),
          it('d14', 'ok', '3 way solenoid valve', { spec: 'ไม่มีน้ำซึม' }),
          val('d15', 'Water inlet temp.', null, 40, '°C', '', { ba: 'after' }),
          val('d16', 'Water outlet temp.', null, 45, '°C', '', { ba: 'after' }),
          val('d17', 'Water inlet pressure', 0.8, null, 'kg/cm²', '', { ba: 'after' }),
          val('d18', 'Water outlet pressure', 0.3, null, 'kg/cm²', '', { ba: 'after' }),
          it('d19', 'ok', 'สภาพทั่วไป')] },

    { id: 'AD', kind: 'daily', code: 'CE97F1005Q', name: 'Air Dryer', th: 'ตรวจรายวัน',
      m: [it('d1', 'ok', 'Compressor noise'),
          val('d2', 'Dew point', null, 10, '°C', '', { ba: 'after', spec: 'ไม่เกิน 10 °C' }),
          it('d3', 'ok', 'Running lamp'),
          it('d4', 'ok', 'Drain test'),
          val('d5', 'Low pressure', 0.35, 0.6, 'MPa', '', { ba: 'after' }),
          val('d6', 'High pressure', 1.1, 1.9, 'MPa', '', { ba: 'after' })] },
  ];
  // which item ids a round's rule covers: 'all', a list of ids, or ranges like '1.1-1.8'
  const parseId = (id) => id.split('.').map(Number);
  function inRule(id, rule) {
    if (rule === 'all') return true;
    if (!rule) return false;
    const [a, b] = parseId(id);
    return rule.some(r => {
      if (!r.includes('-')) return r === id;
      const [from, to] = r.split('-').map(parseId);
      return a === from[0] && b >= from[1] && b <= to[1];
    });
  }
  window.INSP = { FORMS, FIGS, inRule };
})();
