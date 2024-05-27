import { useState } from 'react';
import PropTypes from 'prop-types';

function PSSModal({ isOpen, onClose }) {
    const questions = [
        "Dalam sebulan terakhir, seberapa sering Anda merasa kesal karena sesuatu yang terjadi secara tak terduga?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa Anda tidak dapat mengendalikan hal-hal penting dalam hidup Anda?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa gugup dan stres?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa yakin tentang kemampuan Anda untuk menangani masalah pribadi Anda?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa segala sesuatunya berjalan sesuai dengan keinginan Anda?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa Anda tidak dapat mengatasi semua hal yang harus Anda lakukan?",
        "Dalam sebulan terakhir, seberapa sering Anda dapat mengendalikan gangguan dalam hidup Anda?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa Anda mengendalikan segalanya?",
        "Dalam sebulan terakhir, seberapa sering Anda marah karena hal-hal yang terjadi di luar kendali Anda?",
        "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa kesulitan menumpuk begitu tinggi sehingga Anda tidak bisa mengatasinya?"
    ];
    const [responses, setResponses] = useState(Array(10).fill(""));

    const handleChange = (index, value) => {
        const newResponses = [...responses];
        newResponses[index] = value;
        setResponses(newResponses);
    };

    const calculateScore = () => {
        // Check if all responses are filled
        if (responses.includes("")) {
            alert("Harap isi semua pertanyaan sebelum menghitung skor.");
            return;
        }

        const reverseIndices = [3, 4, 6, 7]; // Questions 4, 5, 7, and 8 (0-based index)
        const reversedResponses = responses.map((response, index) =>
            reverseIndices.includes(index) ? 4 - parseInt(response, 10) : parseInt(response, 10)
        );
        const totalScore = reversedResponses.reduce((acc, curr) => acc + curr, 0);
        onClose(totalScore); // Pass the score back to the parent component
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#EEEEEE] p-8 rounded shadow-md w-full max-w-lg max-h-screen overflow-y-auto md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Perceived Stress Scale</h2>
                {questions.map((question, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-gray-700 mb-2">
                            {question}
                        </label>
                        <select
                            className="w-full border rounded p-2"
                            value={responses[index]}
                            onChange={(e) => handleChange(index, e.target.value)}
                            required
                        >
                            <option value="" hidden>Pilih jawaban</option>
                            <option value="0">Tidak Pernah</option>
                            <option value="1">Hampir Tidak Pernah</option>
                            <option value="2">Kadang-Kadang</option>
                            <option value="3">Cukup Sering</option>
                            <option value="4">Sangat Sering</option>
                        </select>
                    </div>
                ))}
                <button
                    className="bg-[#619A95] hover:bg-[#446c68] text-white font-bold px-4 py-2 rounded"
                    onClick={calculateScore}
                >
                    Hitung Skor
                </button>
                <button
                    className="bg-[#A03C5A] hover:bg-[#702a3f] text-white font-bold px-4 py-2 rounded ml-2"
                    onClick={() => onClose(null)}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}

PSSModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PSSModal;
