import { Course, CourseLevel, SectionType } from '../types/course';

export const COURSES: Course[] = [
    {
        code: 'PY001',
        title: 'Pengenalan Python',
        description: 'Pelajari dasar-dasar Python untuk memulai perjalanan coding Anda',
        level: 'beginner',
        thumbnail_url: 'https://raw.githubusercontent.com/python/cpython/main/PC/icons/pythonpowered.png',
        estimated_time: '2-3 jam',
        order_number: 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: [
            {
                id: 'PY001_01',
                title: 'Apa itu Python?',
                type: 'text',
                order_number: 1,
                content: `
# Pengenalan Python

Python adalah bahasa pemrograman tingkat tinggi yang populer dan mudah dipelajari. Mari kita pelajari mengapa Python menjadi pilihan utama untuk pemula!

## Keunggulan Python

- 🚀 **Sintaks yang Mudah** - Seperti menulis bahasa Inggris sehari-hari
- 🌍 **Serbaguna** - Web, AI, Data Science, Game, dan banyak lagi!
- 👥 **Komunitas Besar** - Bantuan selalu tersedia
- 💡 **Open Source** - Gratis dan terus berkembang

## Mengapa Belajar Python?

1. **Mudah Dipelajari**
   - Sintaks yang jelas dan mudah dibaca
   - Tidak perlu titik koma (;)
   - Indentasi yang terstruktur

2. **Peluang Karir**
   - Data Scientist
   - AI Developer
   - Web Developer
   - Game Developer

3. **Dukungan Library**
   - NumPy untuk komputasi
   - Pandas untuk analisis data
   - TensorFlow untuk AI
   - Django untuk web

## Contoh Kode Python

\`\`\`python
# Program pertama Anda
print("Selamat datang di Python!")

# Variabel sederhana
nama = "Python"
versi = 3.9
is_fun = True

print(f"Belajar {nama} versi {versi} itu {is_fun}!")
\`\`\`

Mari mulai petualangan coding Anda dengan Python! 🐍✨`
            },
            {
                id: 'PY001_02',
                title: 'Variabel dan Tipe Data',
                type: 'text',
                order_number: 2,
                content: `
# Variabel dan Tipe Data di Python 🐍

## Variabel di Python 📦

Variabel adalah tempat untuk menyimpan data. Di Python, Anda tidak perlu mendeklarasikan tipe data secara eksplisit.

\`\`\`python
# Cara membuat variabel
nama = "Budi"          # String
umur = 20             # Integer
tinggi = 170.5        # Float
is_student = True     # Boolean
\`\`\`

## Tipe Data Dasar 🔤

1. **String (str)** - Untuk teks
   \`\`\`python
   nama = "Python"
   pesan = 'Belajar coding itu seru!'
   multi_baris = """
   Ini adalah string
   multi baris
   """
   \`\`\`

2. **Integer (int)** - Bilangan bulat
   \`\`\`python
   umur = 20
   tahun = 2024
   negatif = -10
   \`\`\`

3. **Float** - Bilangan desimal
   \`\`\`python
   berat = 65.5
   suhu = 36.6
   pi = 3.14159
   \`\`\`

4. **Boolean (bool)** - True/False
   \`\`\`python
   is_active = True
   is_valid = False
   \`\`\`

## Tips Penggunaan Variabel 💡

1. Gunakan nama yang bermakna
2. Mulai dengan huruf atau underscore
3. Case sensitive (nama ≠ Nama)
4. Hindari kata kunci Python

## Konversi Tipe Data 🔄

\`\`\`python
# String ke Integer
angka_str = "123"
angka_int = int(angka_str)  # 123

# Integer ke String
umur = 20
umur_str = str(umur)  # "20"

# String ke Float
suhu_str = "36.6"
suhu_float = float(suhu_str)  # 36.6
\`\`\`
`
            },
            {
                id: 'PY001_03',
                title: 'Quiz: Variabel dan Tipe Data',
                type: 'quiz',
                order_number: 3,
                content: JSON.stringify({
                    questions: [
                        {
                            id: 1,
                            question: 'Manakah yang merupakan tipe data di Python?',
                            options: ['str', 'string', 'text', 'chars'],
                            correctAnswer: 'str',
                            explanation: 'str adalah tipe data bawaan Python untuk string/teks'
                        },
                        {
                            id: 2,
                            question: 'Bagaimana cara membuat variabel dengan nilai desimal di Python?',
                            options: [
                                'angka = 3.14',
                                'float angka = 3.14',
                                'decimal angka = 3.14',
                                'var angka = 3.14'
                            ],
                            correctAnswer: 'angka = 3.14',
                            explanation: 'Python menggunakan type inference, jadi kita tidak perlu mendeklarasikan tipe data'
                        },
                        {
                            id: 3,
                            question: 'Manakah yang merupakan nama variabel yang valid di Python?',
                            options: [
                                '_nama',
                                '2nama',
                                'nama-saya',
                                'class'
                            ],
                            correctAnswer: '_nama',
                            explanation: 'Variabel dapat dimulai dengan underscore, tapi tidak dengan angka atau menggunakan kata kunci Python'
                        }
                    ]
                })
            },
            {
                id: 'PY001_04',
                title: 'Latihan Kode: Variabel',
                type: 'code',
                order_number: 4,
                content: JSON.stringify({
                    instructions: `Buatlah variabel-variabel berikut:
1. nama (string) - Isi dengan nama Anda
2. umur (integer) - Isi dengan umur Anda
3. tinggi (float) - Isi dengan tinggi badan Anda dalam cm
4. is_student (boolean) - Set True jika Anda adalah pelajar/mahasiswa

Kemudian print semua variabel tersebut menggunakan f-string`,
                    initialCode: `# Tulis kode Anda di sini
# Contoh penggunaan f-string:
# nama = "Budi"
# print(f"Nama saya {nama}")

`,
                    testCases: [
                        {
                            input: '',
                            expectedOutput: '',
                            test: `
def test_solution():
    # Test tipe data
    assert isinstance(nama, str), "nama harus bertipe string"
    assert isinstance(umur, int), "umur harus bertipe integer"
    assert isinstance(tinggi, float), "tinggi harus bertipe float"
    assert isinstance(is_student, bool), "is_student harus bertipe boolean"
    
    # Test nilai tidak kosong
    assert len(nama) > 0, "nama tidak boleh kosong"
    assert umur > 0, "umur harus lebih dari 0"
    assert tinggi > 0, "tinggi harus lebih dari 0"
`
                        }
                    ]
                })
            }
        ]
    },
    {
        code: 'PY002',
        title: 'Struktur Data Python',
        description: 'Pelajari berbagai struktur data di Python seperti list, tuple, dictionary, dan set',
        level: 'beginner',
        thumbnail_url: 'https://raw.githubusercontent.com/python/cpython/main/PC/icons/py.png',
        estimated_time: '3-4 jam',
        order_number: 2,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sections: [
            {
                id: 'PY002_01',
                title: 'List dan Tuple',
                type: 'text',
                order_number: 1,
                content: `
# List dan Tuple di Python 📚

## List di Python 📝

List adalah struktur data yang dapat menyimpan kumpulan nilai. List bersifat:
- ✏️ Mutable (bisa diubah)
- 📋 Berurutan
- 🔄 Bisa menyimpan berbagai tipe data

### Membuat dan Menggunakan List

\`\`\`python
# Membuat list
buah = ["apel", "jeruk", "mangga"]
angka = [1, 2, 3, 4, 5]
campuran = [1, "dua", 3.0, True]

# Mengakses elemen
print(buah[0])       # apel (indeks pertama)
print(buah[-1])      # mangga (indeks terakhir)
print(buah[0:2])     # ['apel', 'jeruk'] (slicing)

# Mengubah elemen
buah[1] = "anggur"   # mengganti jeruk dengan anggur

# Menambah elemen
buah.append("pisang")    # menambah di akhir
buah.insert(0, "melon")  # menambah di indeks tertentu

# Menghapus elemen
buah.remove("apel")      # menghapus nilai tertentu
del buah[0]              # menghapus berdasarkan indeks
terakhir = buah.pop()    # mengambil & menghapus elemen terakhir
\`\`\`

### Method List yang Sering Digunakan

\`\`\`python
angka = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

# Sorting
angka.sort()             # mengurutkan
angka.reverse()          # membalik urutan

# Informasi
len(angka)               # panjang list
angka.count(5)          # menghitung kemunculan nilai
angka.index(4)          # mencari indeks nilai
\`\`\`

## Tuple di Python 📦

Tuple mirip dengan list, tapi:
- 🔒 Immutable (tidak bisa diubah)
- 💾 Lebih efisien dalam penggunaan memori
- 👥 Cocok untuk data yang tetap

### Membuat dan Menggunakan Tuple

\`\`\`python
# Membuat tuple
koordinat = (3, 4)
warna_rgb = (255, 128, 0)
single = (1,)    # tuple dengan satu elemen

# Mengakses elemen
print(koordinat[0])    # 3
print(warna_rgb[1:])   # (128, 0)

# Operasi tuple
x, y = koordinat       # unpacking
gabung = koordinat + (5, 6)  # menggabungkan tuple

# Method tuple
len(koordinat)         # panjang tuple
warna_rgb.count(255)   # menghitung kemunculan nilai
warna_rgb.index(128)   # mencari indeks nilai
\`\`\`

### Kapan Menggunakan List vs Tuple?

**Gunakan List jika:**
- 📝 Data perlu diubah
- ➕ Perlu menambah/menghapus elemen
- 🔄 Data bersifat dinamis

**Gunakan Tuple jika:**
- 🔒 Data tidak boleh diubah
- 📊 Menyimpan data yang tetap
- 💾 Performa lebih penting
`
            },
            {
                id: 'PY002_02',
                title: 'Quiz: List dan Tuple',
                type: 'quiz',
                order_number: 2,
                content: JSON.stringify({
                    questions: [
                        {
                            id: 1,
                            question: 'Apa perbedaan utama antara List dan Tuple?',
                            options: [
                                'List bisa diubah, Tuple tidak',
                                'List untuk angka, Tuple untuk teks',
                                'List lebih cepat daripada Tuple',
                                'Tidak ada perbedaan'
                            ],
                            correctAnswer: 'List bisa diubah, Tuple tidak',
                            explanation: 'List bersifat mutable (bisa diubah) sedangkan Tuple immutable (tidak bisa diubah)'
                        },
                        {
                            id: 2,
                            question: 'Manakah yang benar untuk menambah elemen ke List?',
                            options: [
                                'list.append(item)',
                                'list.add(item)',
                                'list.push(item)',
                                'list.insert(item)'
                            ],
                            correctAnswer: 'list.append(item)',
                            explanation: 'append() adalah method bawaan Python untuk menambah elemen di akhir list'
                        },
                        {
                            id: 3,
                            question: 'Bagaimana cara membuat tuple dengan satu elemen?',
                            options: [
                                '(1,)',
                                '(1)',
                                'tuple(1)',
                                '[1]'
                            ],
                            correctAnswer: '(1,)',
                            explanation: 'Tuple dengan satu elemen harus menggunakan koma untuk membedakannya dari ekspresi dalam kurung biasa'
                        }
                    ]
                })
            },
            {
                id: 'PY002_03',
                title: 'Latihan Kode: List dan Tuple',
                type: 'code',
                order_number: 3,
                content: JSON.stringify({
                    instructions: `Buatlah program yang:
1. Membuat list 'buah' dengan 3 nama buah
2. Menambahkan 2 buah baru ke list menggunakan append()
3. Membuat tuple 'koordinat' dengan nilai (x=10, y=20)
4. Print panjang list buah dan nilai x dari tuple koordinat`,
                    initialCode: `# Tulis kode Anda di sini
# 1. Buat list buah

# 2. Tambah buah baru

# 3. Buat tuple koordinat

# 4. Print hasil

`,
                    testCases: [
                        {
                            input: '',
                            expectedOutput: '',
                            test: `
def test_solution():
    # Test list buah
    assert isinstance(buah, list), "buah harus bertipe list"
    assert len(buah) >= 5, "list buah harus memiliki minimal 5 elemen"
    assert all(isinstance(b, str) for b in buah), "semua elemen buah harus string"
    
    # Test tuple koordinat
    assert isinstance(koordinat, tuple), "koordinat harus bertipe tuple"
    assert len(koordinat) == 2, "koordinat harus memiliki 2 elemen"
    assert koordinat[0] == 10, "nilai x harus 10"
    assert koordinat[1] == 20, "nilai y harus 20"
`
                        }
                    ]
                })
            }
        ]
    }
]; 