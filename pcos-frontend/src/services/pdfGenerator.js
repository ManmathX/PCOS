import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

/**
 * Generate appointment summary PDF
 * @param {Object} data - User health data
 * @returns {Blob} - PDF blob
 */
export const generateAppointmentPDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(255, 182, 193); // Soft pink
    doc.text('PCOS Wellness - Appointment Summary', pageWidth / 2, yPos, { align: 'center' });

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${format(new Date(), 'PPP')}`, pageWidth / 2, yPos, { align: 'center' });

    yPos += 15;
    doc.setDrawColor(255, 182, 193);
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos += 10;

    // Patient Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Patient Information', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (data.user?.firstName) {
        doc.text(`Name: ${data.user.firstName} ${data.user.lastName || ''}`, 25, yPos);
        yPos += 6;
    }
    if (data.user?.dateOfBirth) {
        doc.text(`Date of Birth: ${format(new Date(data.user.dateOfBirth), 'PP')}`, 25, yPos);
        yPos += 6;
    }

    yPos += 5;

    // Cycle Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Cycle History Summary', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    if (data.cycles && data.cycles.length > 0) {
        doc.text(`Total Cycles Logged: ${data.cycles.length}`, 25, yPos);
        yPos += 6;

        const avgLength = data.avgCycleLength;
        if (avgLength) {
            doc.text(`Average Cycle Length: ${avgLength} days`, 25, yPos);
            yPos += 6;
        }

        doc.text(`Last Period: ${format(new Date(data.cycles[0].startDate), 'PP')}`, 25, yPos);
        yPos += 6;
    } else {
        doc.text('No cycle data available', 25, yPos);
        yPos += 6;
    }

    yPos += 5;

    // Risk Assessment
    if (data.riskScore) {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('PCOS Risk Assessment', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        const riskColor = data.riskScore.riskLevel === 'LOW' ? [34, 197, 94] :
            data.riskScore.riskLevel === 'MODERATE' ? [234, 179, 8] :
                [239, 68, 68];
        doc.setTextColor(...riskColor);
        doc.text(`Risk Level: ${data.riskScore.riskLevel}`, 25, yPos);
        yPos += 6;

        doc.setTextColor(100, 100, 100);
        doc.text(`Score: ${Math.round(data.riskScore.score)}/100`, 25, yPos);
        yPos += 6;

        if (data.riskScore.reasons && data.riskScore.reasons.length > 0) {
            doc.text('Risk Factors:', 25, yPos);
            yPos += 6;

            data.riskScore.reasons.forEach(reason => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`  • ${reason}`, 30, yPos);
                yPos += 5;
            });
        }

        yPos += 5;
    }

    // Symptoms Summary
    if (data.symptoms && data.symptoms.length > 0) {
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Recent Symptoms', 20, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);

        const recentSymptoms = data.symptoms.slice(0, 10);
        recentSymptoms.forEach(symptom => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            const symptomText = `${format(new Date(symptom.date), 'MM/dd')}: ${symptom.symptomType.replace('_', ' ')} (${symptom.severity}/10)`;
            doc.text(`  • ${symptomText}`, 25, yPos);
            yPos += 5;
        });

        yPos += 5;
    }

    // Questions for Doctor
    if (yPos > 230) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Questions to Ask Your Doctor', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    const questions = data.riskScore?.riskLevel === 'HIGH' ? [
        'Should I get a hormone panel (FSH, LH, Testosterone)?',
        'Do you recommend an ovarian ultrasound?',
        'What lifestyle changes would you suggest?',
        'Are there medications I should consider?',
        'How often should I monitor my symptoms?',
    ] : [
        'Are my cycle patterns normal?',
        'Should I make any lifestyle changes?',
        'When should I schedule my next checkup?',
    ];

    questions.forEach(q => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.text(`  • ${q}`, 25, yPos);
        yPos += 6;
    });

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This document is for informational purposes only and does not constitute medical advice.', pageWidth / 2, yPos, { align: 'center' });
    doc.text('Please consult with your healthcare provider for professional medical guidance.', pageWidth / 2, yPos + 4, { align: 'center' });

    return doc.output('blob');
};
