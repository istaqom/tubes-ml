import { useEffect, useState } from 'react'
import maleLogo from './assets/male.svg';
import femaleLogo from './assets/female.svg';
import PSSModal from './modal';
import logoITK from './assets/itk.png';
import logoIF from './assets/if.png';

function App() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bmiCategory, setBmiCategory] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [sleepDuration, setSleepDuration] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [dailySteps, setDailySteps] = useState('');
  const [physicalActivityLevel, setPhysicalActivityLevel] = useState('');
  const [stressLevel, setStressLevel] = useState(null);
  const [sleepDisorder, setSleepDisorder] = useState('none');
  const [sleepQuality, setSleepQuality] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [pssScore, setPssScore] = useState(null);

  const handleModalClose = (score) => {
    if (score !== null) {
      setStressLevel(score / 4);
    }
    setIsModalOpen(false);
  };

  const handlePrediction = async (e) => {
    e.preventDefault();

    if (stressLevel === null) {
      alert("Mohon jawab semua pertanyaan Level Stress");
      return;
    }

    let bmi_value;
    let bmi = weight / (height ** 2);

    if (bmi <= 18.4) {
      bmi_value = "normal_weight";
    } else if (18.5 >= bmi <= 24.9) {
      bmi_value = "normal";
    } else if (25 >= bmi <= 39.9) {
      bmi_value = "overweight";
    } else if (bmi >= 40) {
      bmi_value = "obese";
    }

    const data = {
      "age": parseInt(age),
      "gender_male": (gender == "false") != Boolean(gender),
      "occupation": occupation,
      "bmi_category": bmi_value,
      "sleep_duration": parseInt(sleepDuration),
      "heart_rate": parseInt(heartRate),
      "daily_steps": parseInt(dailySteps),
      "physical_activity_level": parseInt(physicalActivityLevel),
      "stress_level": parseInt(stressLevel),
      "sleep_disorder": sleepDisorder
    };

    try {
      const response = await fetch('https://ml-api.panti.my.id/v2/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      setSleepQuality(result.sleep_quality);
    } catch (error) {
      console.error('Error predicting sleep quality:', error);
    }
  };

  useEffect(() => {
    document.title = "Prediksi Kualitas Tidur by Kelompok 1"
  }, [])

  return (
    <div className='bg-[#1261A7] min-h-screen flex flex-col justify-center items-center'>
      <form className='m-auto text-[#151515] flex flex-col gap-2 bg-[#EEEEEE] p-4 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl my-16' onSubmit={(e) => handlePrediction(e)}>
        <div className='flex flex-col mb-5'>
          <div className="flex flex-row gap-2 items-center">
            <img className='w-1/6 max-w-xs' src={logoITK} alt="ITK" />
            <div className="flex flex-col flex-grow">
              <h1 className='text-3xl font-bold text-center'>Prediksi Kualitas Tidur Menggunakan Regresi Linear</h1>
              <h1 className='text-xl text-center'>by Kelompok 1</h1>
            </div>
            <img className='w-1/6 max-w-xs' src={logoIF} alt="IF" />
          </div>
        </div>
        <div className='flex gap-2 flex-col'>
          <label className='' htmlFor="age">Umur</label>
          <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="age" id="age" onChange={(e) => setAge(e.target.value)} placeholder="Masukkan umur" required />
        </div>
        <div className='flex gap-2 flex-col' onChange={(e) => console.log(e.target.value)}>
          <label className='' htmlFor="gender_male">Jenis Kelamin</label>
          <div className="flex flex-row justify-evenly text-lg">
            <label className='flex gap-2'>
              <input type="radio" name="gender" id="gender" value="true" required />
              <img src={maleLogo} alt="male logo" />
              Laki - laki
            </label>
            <label className='flex gap-2'>
              <input type="radio" name="gender" id="gender" value="false" required />
              <img src={femaleLogo} alt="female logo" />
              Perempuan
            </label>
          </div>
          {/* <select className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' name="gender" id="gender" onChange={(e) => setGender(e.target.value)} required>
            <option value="" hidden>Pilih jenis kelamin</option>
            <option value="true">Laki - laki</option>
            <option value="false">Perempuan</option>
          </select> */}
        </div>
        <div className='flex gap-2 flex-col'>
          <label className='' htmlFor="occupation">Pekerjaan</label>
          <select className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' name="occupation" id="occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} required>
            <option value="" hidden>Pilih pekerjaan</option>
            <option value="software_engineer">Software Engineer</option>
            <option value="doctor">Dokter</option>
            <option value="sales_representative">Sales Representative</option>
            <option value="teacher">Guru</option>
            <option value="nurse">Perawat</option>
            <option value="engineer">Engineer</option>
            <option value="accountant">Akuntan</option>
            <option value="scientist">Ilmuwan</option>
            <option value="lawyer">Pengacara</option>
            <option value="salesperson">Pramuniaga</option>
            <option value="manager">Manajer</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className='flex gap-2 flex-col grow'>
            <label className='' htmlFor="bmi_category">Tinggi badan (Centimeter)</label>
            <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="sleep_duration" id="sleep_duration" onChange={(e) => setHeight(e.target.value)} placeholder="Masukkan tinggi badan" required />
          </div>
          <div className='flex gap-2 flex-col grow'>
            <label className='' htmlFor="bmi_category">Berat Badan (Kilogram)</label>
            <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="sleep_duration" id="sleep_duration" onChange={(e) => setWeight(e.target.value)} placeholder="Masukkan berat badan" required />
          </div>
        </div>


        <div className='flex gap-2 flex-col'>
          <label className='' htmlFor="sleep_duration">Durasi Tidur (Jam)</label>
          <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" step="0.1" name="sleep_duration" id="sleep_duration" onChange={(e) => setSleepDuration(e.target.value)} placeholder="Masukkan durasi tidur" required />
        </div>
        <div className='flex gap-2 flex-col mt-8'>
          <div className='flex flex-col gap-0'>
            <label className='' htmlFor="heart_rate">Detak Jantung (BPM)</label>
            <label className='text-xs' htmlFor="">Orang normal biasanya memiliki detak jantung di angka 85 - 155</label>
          </div>
          <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="heart_rate" id="heart_rate" onChange={(e) => setHeartRate(e.target.value)} placeholder="Masukkan detak jantung" required />
        </div>
        <div className='flex gap-2 flex-col'>
          <div className='flex flex-col gap-0'>
            <label className='' htmlFor="daily_steps">Langkah Harian</label>
            <label className='text-xs' htmlFor="">Seseorang biasanya memiliki 4000 hingga 5000 langkah setiap harinya</label>
          </div>
          <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="daily_steps" id="daily_steps" onChange={(e) => setDailySteps(e.target.value)} placeholder="Masukkan langkah harian" required />
        </div>
        <div className='flex gap-2 flex-col'>
          <div className='flex flex-col gap-0'>
            <label className='' htmlFor="physical_activity_level">Tingkat Aktifitas Fisik (0 - 100)</label>
            <label className='text-xs' htmlFor="">Menurutmu aktifitasi harianmu memiliki nilai berapa?</label>
          </div>
          <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="physical_activity_level" id="physical_activity_level" onChange={(e) => setPhysicalActivityLevel(e.target.value)} placeholder="Masukkan tingkat aktifitas fisik" required />
        </div>

        <div className='flex gap-2 flex-col'>
          <div className='flex flex-col gap-0'>
            <label className='' htmlFor="stress_level">Level Stress</label>
            {/* <label className='text-xs' htmlFor="">Seberapa stress hari - harimu?</label> */}
          </div>
          {/* <input className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' type="number" name="stress_level" id="stress_level" onChange={(e) => setStressLevel(e.target.value)} placeholder="Masukkan level stress" required /> */}
          <button
            className={`${stressLevel == null ? 'bg-[#1261A7] hover:bg-[#0d4475]' : 'bg-[#619A95] hover:bg-[#446c68]'} text-white px-4 py-2 rounded`}
            onClick={() => setIsModalOpen(true)}
          >
            Jawab pertanyaan berikut
          </button>
        </div>

        <div className='flex gap-2 flex-col'>
          <label className='' htmlFor="sleep_disorder">Gangguan Tidur</label>
          <select className='text-[#151515] p-2 rounded-lg border-slate-500 border-[0.5px]' name="sleep_disorder" id="sleep_disorder" onChange={(e) => setSleepDisorder(e.target.value)} required>
            <option value="none" defaultValue>Tidak ada</option>
            <option value="sleep_apnea">Sleep Apnea</option>
            <option value="insomnia">Insomnia</option>
          </select>
        </div>

        <PSSModal isOpen={isModalOpen} onClose={handleModalClose} />

        {sleepQuality !== null && (
          <div className='mt-4 text-center'>
            <p className=''>Hasil Prediksi Kualitas Tidurmu adalah</p>
            <p className={`text-2xl ${sleepQuality <= 3 ? 'text-[#A03C5A]' : sleepQuality <= 7 ? 'text-[#DAA21B]' : 'text-[#619A95]'}`}>{sleepQuality}/10</p>
          </div>
          // </div>
        )}
        <button className='bg-[#1261A7] hover:bg-[#0d4475] text-white font-bold py-2 px-4 rounded mt-8' type='submit'>Prediksi</button>
      </form>
    </div>
  );
}

export default App
