import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChallenges() {
    console.log('Seeding challenges...');

    const challenges = [
        {
            name: '7-Day Walk Challenge',
            description: '10,000 steps daily for 7 consecutive days',
            duration: 7,
            habitType: 'walk_10k',
            pcosConnection: 'Regular walking improves insulin sensitivity and hormone balance',
        },
        {
            name: '10-Day Sugar-Free Challenge',
            description: 'Eliminate added sugars from your diet for 10 days',
            duration: 10,
            habitType: 'no_sugar',
            pcosConnection: 'Reducing sugar helps manage insulin resistance, a key PCOS factor',
        },
        {
            name: '7-Day Sleep Optimization',
            description: '7+ hours of quality sleep every night for a week',
            duration: 7,
            habitType: 'sleep_7h',
            pcosConnection: 'Quality sleep regulates cortisol and reproductive hormones',
        },
        {
            name: '14-Day Mindful Eating',
            description: 'Practice mindful eating habits with no distractions for 2 weeks',
            duration: 14,
            habitType: 'mindful_eating',
            pcosConnection: 'Mindful eating supports healthy weight and reduces stress hormones',
        },
        {
            name: '5-Day Meditation Streak',
            description: '10 minutes of meditation daily for 5 days',
            duration: 5,
            habitType: 'mindful_eating',
            pcosConnection: 'Meditation reduces stress and helps balance cortisol levels',
        },
    ];

    // Use createMany with skipDuplicates
    const result = await prisma.challenge.createMany({
        data: challenges,
        skipDuplicates: true,
    });

    console.log(`✅ ${result.count} challenges seeded successfully!`);
}

seedChallenges()
    .catch((e) => {
        console.error('Error seeding challenges:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
