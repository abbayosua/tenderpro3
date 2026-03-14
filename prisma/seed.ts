import { UserRole, ProjectStatus, BidStatus, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { db } from '../src/lib/db';

const prisma = db;

async function main() {
  // Clear existing data
  await prisma.bid.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.document.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.project.deleteMany();
  await prisma.contractorProfile.deleteMany();
  await prisma.ownerProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tenderpro.id',
      password: hashedPassword,
      name: 'Admin TenderPro',
      phone: '021-12345678',
      role: UserRole.ADMIN,
      isVerified: true,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  // Create Contractors
  const contractors = await Promise.all([
    prisma.user.create({
      data: {
        email: 'info@ptbangunpermai.co.id',
        password: hashedPassword,
        name: 'Ahmad Sulaiman',
        phone: '081234567890',
        role: UserRole.CONTRACTOR,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        contractor: {
          create: {
            companyName: 'PT Bangun Permai Sejahtera',
            companyType: 'PT',
            npwp: '01.234.567.8-012.345',
            nib: 'NIB1234567890',
            address: 'Jl. Sudirman No. 123, Blok A',
            city: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12190',
            specialization: 'Pembangunan Rumah, Renovasi',
            experienceYears: 15,
            employeeCount: 50,
            rating: 4.8,
            totalProjects: 120,
            completedProjects: 115,
            description: 'Perusahaan konstruksi terpercaya dengan pengalaman lebih dari 15 tahun dalam pembangunan rumah tinggal dan komersial. Kami berkomitmen memberikan hasil terbaik dengan standar kualitas tinggi.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'info@ptrumahidaman.co.id',
        password: hashedPassword,
        name: 'Budi Santoso',
        phone: '082345678901',
        role: UserRole.CONTRACTOR,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        contractor: {
          create: {
            companyName: 'PT Rumah Idaman Konstruksi',
            companyType: 'PT',
            npwp: '02.345.678.9-012.345',
            nib: 'NIB2345678901',
            address: 'Jl. Gatot Subroto No. 45',
            city: 'Bandung',
            province: 'Jawa Barat',
            postalCode: '40123',
            specialization: 'Renovasi, Interior',
            experienceYears: 10,
            employeeCount: 35,
            rating: 4.6,
            totalProjects: 85,
            completedProjects: 80,
            description: 'Spesialis renovasi dan desain interior rumah tinggal. Kami mengutamakan kepuasan pelanggan dengan hasil yang memuaskan dan tepat waktu.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'info@ptkonstrukindo.co.id',
        password: hashedPassword,
        name: 'Dewi Kartika',
        phone: '083456789012',
        role: UserRole.CONTRACTOR,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        contractor: {
          create: {
            companyName: 'PT Konstrukindo Maju Jaya',
            companyType: 'PT',
            npwp: '03.456.789.0-123.456',
            nib: 'NIB3456789012',
            address: 'Jl. Pemuda No. 78',
            city: 'Surabaya',
            province: 'Jawa Timur',
            postalCode: '60123',
            specialization: 'Pembangunan Baru, Komersial',
            experienceYears: 20,
            employeeCount: 100,
            rating: 4.9,
            totalProjects: 200,
            completedProjects: 195,
            description: 'Perusahaan konstruksi skala besar dengan pengalaman 20 tahun. Mengerjakan proyek perumahan, perkantoran, dan komersial dengan standar internasional.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'info@ptrenovasi.co.id',
        password: hashedPassword,
        name: 'Eko Prasetyo',
        phone: '084567890123',
        role: UserRole.CONTRACTOR,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        contractor: {
          create: {
            companyName: 'PT Renovasi Prima',
            companyType: 'PT',
            npwp: '04.567.890.1-234.567',
            nib: 'NIB4567890123',
            address: 'Jl. Diponegoro No. 56',
            city: 'Semarang',
            province: 'Jawa Tengah',
            postalCode: '50123',
            specialization: 'Renovasi, Pemeliharaan',
            experienceYears: 8,
            employeeCount: 25,
            rating: 4.5,
            totalProjects: 60,
            completedProjects: 58,
            description: 'Ahli renovasi dan pemeliharaan rumah dengan harga terjangkau. Kualitas tetap menjadi prioritas utama kami.',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'info@ptarsitek.co.id',
        password: hashedPassword,
        name: 'Fitri Handayani',
        phone: '085678901234',
        role: UserRole.CONTRACTOR,
        isVerified: false,
        verificationStatus: VerificationStatus.PENDING,
        contractor: {
          create: {
            companyName: 'PT Arsitektur Modern Indonesia',
            companyType: 'PT',
            npwp: '05.678.901.2-345.678',
            nib: 'NIB5678901234',
            address: 'Jl. Asia Afrika No. 89',
            city: 'Bandung',
            province: 'Jawa Barat',
            postalCode: '40111',
            specialization: 'Desain Arsitektur, Pembangunan Modern',
            experienceYears: 12,
            employeeCount: 45,
            rating: 4.7,
            totalProjects: 95,
            completedProjects: 90,
            description: 'Menggabungkan desain arsitektur modern dengan konstruksi berkualitas. Setiap proyek adalah karya seni yang fungsional.',
          },
        },
      },
    }),
  ]);

  // Create Project Owners
  const owners = await Promise.all([
    prisma.user.create({
      data: {
        email: 'andriansyah@gmail.com',
        password: hashedPassword,
        name: 'Andriansyah Putra',
        phone: '086789012345',
        role: UserRole.OWNER,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        owner: {
          create: {
            address: 'Jl. Kemang Raya No. 12',
            city: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12730',
            totalProjects: 3,
            activeProjects: 1,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'ratna.sari@gmail.com',
        password: hashedPassword,
        name: 'Ratna Sari',
        phone: '087890123456',
        role: UserRole.OWNER,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        owner: {
          create: {
            address: 'Jl. Dago Atas No. 34',
            city: 'Bandung',
            province: 'Jawa Barat',
            postalCode: '40135',
            totalProjects: 2,
            activeProjects: 1,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'info@ptproperti.co.id',
        password: hashedPassword,
        name: 'Hendri Wijaya',
        phone: '088901234567',
        role: UserRole.OWNER,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        owner: {
          create: {
            companyName: 'PT Properti Nusantara',
            companyType: 'PT',
            npwp: '06.789.012.3-456.789',
            address: 'Jl. HR Rasuna Said No. 100',
            city: 'Jakarta Selatan',
            province: 'DKI Jakarta',
            postalCode: '12950',
            totalProjects: 15,
            activeProjects: 3,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'siti.rahayu@gmail.com',
        password: hashedPassword,
        name: 'Siti Rahayu',
        phone: '089012345678',
        role: UserRole.OWNER,
        isVerified: true,
        verificationStatus: VerificationStatus.VERIFIED,
        owner: {
          create: {
            address: 'Jl. Pahlawan No. 45',
            city: 'Surabaya',
            province: 'Jawa Timur',
            postalCode: '60123',
            totalProjects: 1,
            activeProjects: 1,
          },
        },
      },
    }),
  ]);

  // Get contractor profile IDs
  const contractorProfiles = await prisma.contractorProfile.findMany({
    where: {
      userId: { in: contractors.map(c => c.id) }
    }
  });
  const contractorProfileMap = new Map(contractorProfiles.map(p => [p.userId, p.id]));

  // Create Portfolios for contractors
  const portfolios = [
    {
      contractorId: contractorProfileMap.get(contractors[0].id)!,
      title: 'Pembangunan Rumah Mewah 2 Lantai',
      description: 'Pembangunan rumah mewah dengan 5 kamar tidur, kolam renang, dan taman. Desain modern minimalis dengan sentuhan tropis.',
      category: 'Pembangunan Baru',
      clientName: 'Bapak Wijaya',
      location: 'Kemang, Jakarta Selatan',
      year: 2023,
      budget: 2500000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[0].id)!,
      title: 'Renovasi Total Rumah Tua',
      description: 'Renovasi total rumah peninggalan orang tua menjadi rumah modern dengan mempertahankan nilai historis.',
      category: 'Renovasi',
      clientName: 'Ibu Hartono',
      location: 'Menteng, Jakarta Pusat',
      year: 2023,
      budget: 850000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[0].id)!,
      title: 'Pembangunan Komplek Perumahan',
      description: 'Pembangunan komplek perumahan dengan 20 unit rumah type 70/90.',
      category: 'Pembangunan Baru',
      clientName: 'PT Griya Asri',
      location: 'Bekasi, Jawa Barat',
      year: 2022,
      budget: 15000000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[1].id)!,
      title: 'Renovasi Dapur dan Kamar Mandi',
      description: 'Renovasi dapur dan 2 kamar mandi dengan konsep modern dan fungsional.',
      category: 'Renovasi',
      clientName: 'Keluarga Tanaka',
      location: 'Bandung',
      year: 2023,
      budget: 350000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[1].id)!,
      title: 'Desain Interior Rumah Minimalis',
      description: 'Desain dan pengerjaan interior untuk rumah minimalis 2 lantai.',
      category: 'Interior',
      clientName: 'Bapak Pratama',
      location: 'Cimahi, Jawa Barat',
      year: 2023,
      budget: 450000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[2].id)!,
      title: 'Pembangunan Gedung Perkantoran',
      description: 'Pembangunan gedung perkantoran 5 lantai dengan fasilitas lengkap.',
      category: 'Komersial',
      clientName: 'PT Maju Bersama',
      location: 'Surabaya',
      year: 2022,
      budget: 25000000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[2].id)!,
      title: 'Pembangunan Ruko 3 Lantai',
      description: 'Pembangunan 10 unit ruko 3 lantai di lokasi strategis.',
      category: 'Komersial',
      clientName: 'PT Sentra Bisnis',
      location: 'Gresik, Jawa Timur',
      year: 2023,
      budget: 15000000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[3].id)!,
      title: 'Renovasi Atap dan Plafon',
      description: 'Penggantian atap dan renovasi plafon rumah type 45.',
      category: 'Renovasi',
      clientName: 'Ibu Suharti',
      location: 'Semarang',
      year: 2023,
      budget: 150000000,
    },
    {
      contractorId: contractorProfileMap.get(contractors[4].id)!,
      title: 'Rumah Modern Minimalis',
      description: 'Pembangunan rumah minimalis dengan desain arsitektur unik dan modern.',
      category: 'Pembangunan Baru',
      clientName: 'Keluarga Anderson',
      location: 'Lembang, Bandung',
      year: 2023,
      budget: 1800000000,
    },
  ];

  for (const portfolio of portfolios) {
    await prisma.portfolio.create({
      data: portfolio,
    });
  }

  // Create Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        ownerId: owners[0].id,
        title: 'Pembangunan Rumah 2 Lantai di Depok',
        description: 'Saya ingin membangun rumah 2 lantai dengan luas tanah 150m2 dan luas bangunan 200m2. Rumah dengan 4 kamar tidur, 3 kamar mandi, ruang keluarga, dapur, dan carport. Desain yang diinginkan adalah modern minimalis.',
        category: 'Pembangunan Baru',
        location: 'Depok, Jawa Barat',
        budget: 1200000000,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-09-01'),
        duration: 180,
        status: ProjectStatus.OPEN,
        requirements: JSON.stringify([
          'Surat Izin Mendirikan Bangunan (IMB)',
          'Gambar desain arsitektur',
          'Rencana Anggaran Biaya (RAB) detail',
          'Jaminan garansi pekerjaan minimal 1 tahun',
        ]),
        viewCount: 234,
      },
    }),
    prisma.project.create({
      data: {
        ownerId: owners[1].id,
        title: 'Renovasi Total Rumah Type 45',
        description: 'Renovasi total rumah type 45 menjadi lebih modern. Renovasi meliputi: penggantian lantai, renovasi dapur dan kamar mandi, pengecatan ulang, dan penambahan kanopi. Saya ingin hasil yang berkualitas dengan harga terjangkau.',
        category: 'Renovasi',
        location: 'Bandung, Jawa Barat',
        budget: 400000000,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-04-15'),
        duration: 60,
        status: ProjectStatus.OPEN,
        requirements: JSON.stringify([
          'Portofolio proyek renovasi sebelumnya',
          'Rencana kerja dan timeline',
          'Garansi hasil pekerjaan',
        ]),
        viewCount: 156,
      },
    }),
    prisma.project.create({
      data: {
        ownerId: owners[2].id,
        title: 'Pembangunan Ruko 2 Lantai',
        description: 'Pembangunan 5 unit ruko 2 lantai di lokasi komersial. Setiap ruko memiliki luas tanah 72m2 dan luas bangunan 120m2. Desain yang diinginkan adalah modern tropis dengan fasad yang menarik.',
        category: 'Komersial',
        location: 'Tangerang, Banten',
        budget: 5000000000,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-01-01'),
        duration: 270,
        status: ProjectStatus.OPEN,
        requirements: JSON.stringify([
          'Pengalaman proyek komersial minimal 5 tahun',
          'NIB dan SIUP yang valid',
          'Portofolio proyek serupa',
          'Sertifikat keahlian dari asosiasi konstruksi',
          'Rekening koran 6 bulan terakhir',
        ]),
        viewCount: 312,
      },
    }),
    prisma.project.create({
      data: {
        ownerId: owners[3].id,
        title: 'Renovasi Dapur dan Kamar Mandi',
        description: 'Renovasi dapur menjadi dapur modern dengan island, dan renovasi 2 kamar mandi dengan shower dan bathtub. Total luas area yang direnovasi sekitar 25m2.',
        category: 'Renovasi',
        location: 'Surabaya, Jawa Timur',
        budget: 250000000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-15'),
        duration: 45,
        status: ProjectStatus.OPEN,
        requirements: JSON.stringify([
          'Portofolio renovasi interior',
          'Contoh material yang akan digunakan',
          'Timeline pengerjaan',
        ]),
        viewCount: 98,
      },
    }),
    prisma.project.create({
      data: {
        ownerId: owners[0].id,
        title: 'Pembangunan Kolam Renang',
        description: 'Pembangunan kolam renang ukuran 4x8 meter dengan kedalaman 1.2-1.8 meter. Dilengkapi dengan sistem filtrasi, pemanas air, dan decking batu alam.',
        category: 'Pembangunan Baru',
        location: 'Depok, Jawa Barat',
        budget: 350000000,
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-06-30'),
        duration: 60,
        status: ProjectStatus.DRAFT,
        requirements: JSON.stringify([
          'Pengalaman pembangunan kolam renang',
          'Sertifikat teknis kolam renang',
        ]),
        viewCount: 67,
      },
    }),
    prisma.project.create({
      data: {
        ownerId: owners[2].id,
        title: 'Pembangunan Perumahan Cluster',
        description: 'Pembangunan cluster perumahan dengan 30 unit rumah type 60/84. Fasilitas: gerbang keamanan, taman bermain, dan masjid.',
        category: 'Pembangunan Baru',
        location: 'Bekasi, Jawa Barat',
        budget: 25000000000,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2025-06-01'),
        duration: 365,
        status: ProjectStatus.OPEN,
        requirements: JSON.stringify([
          'Pengalaman developer perumahan',
          'Modal kerja minimal 20% dari nilai proyek',
          'Sertifikat ISO 9001',
          'Pengalaman proyek senilai minimal 50 miliar',
        ]),
        viewCount: 456,
      },
    }),
  ]);

  // Create Bids
  const bids = [
    {
      projectId: projects[0].id,
      contractorId: contractors[0].id,
      proposal: 'PT Bangun Permai Sejahtera berkomitmen untuk membangun rumah impian Anda dengan standar kualitas terbaik. Kami akan menggunakan material berkualitas tinggi dengan tim profesional yang berpengalaman. Desain modern minimalis akan diwujudkan dengan detail yang presisi.',
      price: 1150000000,
      duration: 175,
      startDate: new Date('2024-03-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[0].id,
      contractorId: contractors[2].id,
      proposal: 'Dengan pengalaman 20 tahun dalam konstruksi, PT Konstrukindo Maju Jaya menawarkan solusi pembangunan rumah yang efisien dan berkualitas. Kami memberikan garansi 2 tahun untuk seluruh pekerjaan.',
      price: 1180000000,
      duration: 165,
      startDate: new Date('2024-03-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[0].id,
      contractorId: contractors[4].id,
      proposal: 'Sebagai spesialis desain arsitektur modern, kami akan membangun rumah yang tidak hanya indah tetapi juga fungsional. Setiap sudut ruangan akan dimaksimalkan fungsinya.',
      price: 1250000000,
      duration: 180,
      startDate: new Date('2024-03-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[1].id,
      contractorId: contractors[1].id,
      proposal: 'PT Rumah Idaman Konstruksi siap membantu mewujudkan rumah impian Anda. Kami spesialis renovasi dengan hasil yang memuaskan dan tepat waktu. Gratis konsultasi desain interior.',
      price: 380000000,
      duration: 55,
      startDate: new Date('2024-02-15'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[1].id,
      contractorId: contractors[3].id,
      proposal: 'Renovasi Prima menawarkan harga kompetitif dengan kualitas terjamin. Kami telah menyelesaikan lebih dari 50 proyek renovasi dengan tingkat kepuasan pelanggan 98%.',
      price: 350000000,
      duration: 50,
      startDate: new Date('2024-02-20'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[2].id,
      contractorId: contractors[0].id,
      proposal: 'PT Bangun Permai Sejahtera memiliki pengalaman luas dalam pembangunan ruko dan properti komersial. Kami akan memastikan setiap unit ruko memiliki kualitas terbaik dengan desain menarik.',
      price: 4850000000,
      duration: 260,
      startDate: new Date('2024-04-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[2].id,
      contractorId: contractors[2].id,
      proposal: 'Dengan portofolio 15 proyek komersial sejenis, PT Konstrukindo Maju Jaya adalah pilihan tepat untuk proyek Anda. Kami menawarkan desain gratis dan garansi 3 tahun.',
      price: 4700000000,
      duration: 250,
      startDate: new Date('2024-04-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[3].id,
      contractorId: contractors[1].id,
      proposal: 'Spesialis renovasi interior dengan hasil berkualitas. Kami akan mengubah dapur dan kamar mandi Anda menjadi modern dan fungsional dengan harga yang kompetitif.',
      price: 235000000,
      duration: 40,
      startDate: new Date('2024-02-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[3].id,
      contractorId: contractors[3].id,
      proposal: 'Renovasi dapur dan kamar mandi dengan material premium dan pengerjaan rapi. Garansi 1 tahun untuk seluruh pekerjaan.',
      price: 220000000,
      duration: 42,
      startDate: new Date('2024-02-05'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[5].id,
      contractorId: contractors[0].id,
      proposal: 'Pembangunan cluster perumahan dengan standar kualitas premium. PT Bangun Permai Sejahtera telah mengerjakan 3 proyek serupa dengan total 150 unit rumah.',
      price: 24500000000,
      duration: 350,
      startDate: new Date('2024-06-01'),
      status: BidStatus.PENDING,
    },
    {
      projectId: projects[5].id,
      contractorId: contractors[2].id,
      proposal: 'PT Konstrukindo Maju Jaya menawarkan pembangunan cluster dengan fasilitas lengkap. Kami berpengalaman dalam proyek perumahan skala besar dengan portofolio lebih dari 500 unit rumah.',
      price: 24000000000,
      duration: 340,
      startDate: new Date('2024-06-01'),
      status: BidStatus.PENDING,
    },
  ];

  for (const bid of bids) {
    await prisma.bid.create({
      data: bid,
    });
  }

  // Create Documents for verification
  await prisma.document.createMany({
    data: [
      {
        userId: contractors[0].id,
        type: 'KTP',
        name: 'KTP Direktur - Ahmad Sulaiman',
        fileUrl: '/documents/ktp_ahmad.pdf',
        verified: true,
        verifiedAt: new Date(),
      },
      {
        userId: contractors[0].id,
        type: 'NPWP',
        name: 'NPWP Perusahaan',
        fileUrl: '/documents/npwp_bangunpermai.pdf',
        verified: true,
        verifiedAt: new Date(),
      },
      {
        userId: contractors[0].id,
        type: 'SIUP',
        name: 'Surat Izin Usaha Perdagangan',
        fileUrl: '/documents/siup_bangunpermai.pdf',
        verified: true,
        verifiedAt: new Date(),
      },
      {
        userId: contractors[0].id,
        type: 'NIB',
        name: 'Nomor Induk Berusaha',
        fileUrl: '/documents/nib_bangunpermai.pdf',
        verified: true,
        verifiedAt: new Date(),
      },
    ],
  });

  console.log('Seed data created successfully!');
  console.log(`Created ${contractors.length} contractors`);
  console.log(`Created ${owners.length} project owners`);
  console.log(`Created ${projects.length} projects`);
  console.log(`Created ${portfolios.length} portfolios`);
  console.log(`Created ${bids.length} bids`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
