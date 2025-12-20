import React from 'react';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

const MYTHS = [
    {
        myth: "PCOS means you can't get pregnant",
        reality: "While PCOS can make it harder to conceive, many women with PCOS do get pregnant naturally. Treatment options like lifestyle changes and medications can significantly improve fertility.",
        isTrue: false,
    },
    {
        myth: "Only overweight women get PCOS",
        reality: "PCOS affects women of all body types. While weight plays a role in symptoms, lean women can also have PCOS. It's a hormonal condition, not just a weight issue.",
        isTrue: false,
    },
    {
        myth: "PCOS is just irregular periods",
        reality: "PCOS is a complex hormonal disorder that can affect metabolism, fertility, mental health, and long-term health risks like diabetes and heart disease.",
        isTrue: false,
    },
    {
        myth: "Birth control pills cure PCOS",
        reality: "Birth control can manage symptoms like irregular periods and acne, but it doesn't cure PCOS. It masks symptoms while you're taking it.",
        isTrue: false,
    },
    {
        myth: "Lifestyle changes really do help PCOS",
        reality: "TRUE! Diet, exercise, stress management, and sleep improvements can significantly reduce PCOS symptoms, improve insulin sensitivity, and regulate hormones.",
        isTrue: true,
    },
    {
        myth: "You need to cut out all carbs",
        reality: "You don't need to eliminate carbs completely. Focus on complex carbs (whole grains, vegetables) and balance them with protein and healthy fats. Moderation, not elimination.",
        isTrue: false,
    },
];

const MythCard = ({ myth }) => (
    <div className="card">
        <div className="flex items-start space-x-3 mb-3">
            {myth.isTrue ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            ) : (
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            )}
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                    {myth.isTrue ? '✓ TRUE: ' : '✗ MYTH: '}
                    {myth.myth}
                </h3>
                <p className="text-sm text-gray-700">{myth.reality}</p>
            </div>
        </div>
    </div>
);

export const EducationPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">PCOS Myth Busters</h2>
                <p className="text-gray-600">Separate fact from fiction with evidence-based information</p>
            </div>

            <div className="medical-disclaimer">
                <p className="text-xs font-medium">
                    📚 All information is for educational purposes. Consult your doctor for personalized medical advice.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {MYTHS.map((myth, idx) => (
                    <MythCard key={idx} myth={myth} />
                ))}
            </div>

            <div className="card bg-gradient-to-r from-soft-pink-50 to-sage-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-sage-600" />
                    Understanding PCOS
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                    <div>
                        <h4 className="font-semibold mb-1">What is PCOS?</h4>
                        <p>Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting 1 in 10 women. It involves hormonal imbalances, irregular periods, and metabolic issues.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Common Symptoms</h4>
                        <p>Irregular periods, excess hair growth, acne, weight gain, thinning hair, and difficulty getting pregnant. Symptoms vary greatly between individuals.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Diagnosis</h4>
                        <p>PCOS is typically diagnosed using the Rotterdam criteria: irregular periods, high androgens, and/or polycystic ovaries on ultrasound (2 of 3 needed).</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Management</h4>
                        <p>Lifestyle changes (diet, exercise), medications (metformin, birth control), and regular monitoring. Early management reduces long-term health risks.</p>
                    </div>
                </div>
            </div>

            <div className="card bg-sage-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Helpful Resources</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <p>• <span className="font-medium">PCOS Awareness Association</span> - Patient support and education</p>
                    <p>• <span className="font-medium">American College of Obstetricians and Gynecologists</span> - Medical guidelines</p>
                    <p>• <span className="font-medium">PCOS Challenge</span> - Community support and advocacy</p>
                    <p>• <span className="font-medium">Your Doctor</span> - Personalized medical care and treatment plans</p>
                </div>
            </div>
        </div>
    );
};
