import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'student' | 'staff'

export interface Book {
  id: string
  title: string
  subtitle?: string
  author: string
  category: string
  floor?: string
  shelf?: string
  status: 'available' | 'checked-out' | 'waitlisted'
  rating: number
  reviewsCount: number
  published: string
  isbn: string
  description: string
  coverUrl: string
  coverAlt: string
  aiMatch?: boolean
  dueDate?: string
  waitlistCount?: number
}

export interface Loan {
  id: string
  bookId: string
  title: string
  author: string
  dueDate: string
  status: 'on-track' | 'due-soon' | 'overdue'
  coverUrl: string
  coverAlt: string
}

export interface LoanHistoryItem {
  id: string
  title: string
  author: string
  returnedDate: string
  status: 'Returned On Time' | 'Late (Paid)' | 'Late (Outstanding)'
}

export interface Fine {
  id: string
  type: string
  details: string
  amount: number
}

export interface DigitalResource {
  id: string
  title: string
  author: string
  addedDate: string
  fileSize: string
  format: 'PDF' | 'EPUB'
  status: 'available' | 'reserved' | 'maintenance'
  tags: string[]
  isPublic: boolean
}

export interface RequestApproval {
  id: string
  requesterName: string
  requesterInitials: string
  requesterRole: string
  type: string
  bookTitle: string
}

export interface LowStockAlert {
  id: string
  title: string
  author: string
  quantityLeft: number
  actionLabel: 'ORDER REPLACEMENT' | 'RUSH ORDER' | 'REVIEW STOCK'
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
}

interface LibraryContextType {
  // Auth & Navigation
  isLoggedIn: boolean
  role: UserRole
  theme: 'light' | 'dark'
  userProfile: {
    name: string
    email: string
    avatarUrl: string
  }
  login: (email: string, role: UserRole) => void
  logout: () => void
  setRole: (role: UserRole) => void
  toggleTheme: () => void
  
  // Catalogue & Books
  books: Book[]
  selectedBook: Book | null
  setSelectedBook: (book: Book | null) => void
  borrowBook: (bookId: string) => void
  reserveBook: (bookId: string) => void
  addCatalogueBook: (title: string, subtitle: string, author: string, category: string, floor: string, shelf: string, published: string, isbn: string, description: string, coverUrl: string) => void
  isNewBookModalOpen: boolean
  setIsNewBookModalOpen: (open: boolean) => void
  
  // Loans & Fines
  loans: Loan[]
  loanHistory: LoanHistoryItem[]
  fines: Fine[]
  totalFines: number
  renewLoan: (loanId: string) => void
  payFinesWithPaystack: () => void
  isPaystackOpen: boolean
  setIsPaystackOpen: (open: boolean) => void

  // Digital Resources
  resources: DigitalResource[]
  uploadResource: (title: string, author: string, tags: string[], isPublic: boolean, fileFormat: 'PDF' | 'EPUB', fileSize: string) => void
  deleteResource: (id: string) => void
  toggleResourceVisibility: (id: string) => void
  isUploadModalOpen: boolean
  setIsUploadModalOpen: (open: boolean) => void

  // Staff Portal
  approvals: RequestApproval[]
  lowStockAlerts: LowStockAlert[]
  approveRequest: (id: string) => void
  rejectRequest: (id: string) => void
  orderRestock: (alertId: string) => void

  // Analytics Metrics
  analyticsMetrics: {
    totalItems: string
    activeLoansCount: number
    overdueItemsCount: number
    finesCollected: string
    borrowingTrends: number[]
  }

  // UI Interactive States
  notifications: { id: string; text: string; read: boolean; date: string }[]
  clearNotifications: () => void
  isAIAssistantOpen: boolean
  setIsAIAssistantOpen: (open: boolean) => void
  chatHistory: ChatMessage[]
  sendChatMessage: (text: string) => void
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined)

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('unilib_isLoggedIn') === 'true'
  })
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('unilib_role') as UserRole) || 'student'
  })
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('unilib_theme') as 'light' | 'dark') || 'light'
  })
  const [isPaystackOpen, setIsPaystackOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isNewBookModalOpen, setIsNewBookModalOpen] = useState(false)

  const [userProfile, setUserProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@university.edu',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLpdVBX_dnQN_2yMknR1HzrdUCDRwI_CAXBm2by92RxCg88kJ9_cYpm5bF3aWcaT4qlSy_zJELII0IH8hF_IuvbmVFrO91gwry8ej9hWQtRtlJn2y88-vLcfa8olZGzqAs7JU7wK4W_OuWerMNc6NZCZmjgkQh2qq2f7Vn57v1up7sUGjkt-CQplUf5XIi4D0_gYwXPYPE09-ymbm1voTHLx_1jlXIycQZz6M7U_mglfSRfkz4dCXDlstZthj99Pxdv1YKGv0WVUw'
  })

  // Synchronize dynamic layout classes for light/dark
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('unilib_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

  const login = (email: string, selectedRole: UserRole) => {
    const name = email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') || 'Scholar'
    setUserProfile({
      name,
      email,
      avatarUrl: selectedRole === 'student' 
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLpdVBX_dnQN_2yMknR1HzrdUCDRwI_CAXBm2by92RxCg88kJ9_cYpm5bF3aWcaT4qlSy_zJELII0IH8hF_IuvbmVFrO91gwry8ej9hWQtRtlJn2y88-vLcfa8olZGzqAs7JU7wK4W_OuWerMNc6NZCZmjgkQh2qq2f7Vn57v1up7sUGjkt-CQplUf5XIi4D0_gYwXPYPE09-ymbm1voTHLx_1jlXIycQZz6M7U_mglfSRfkz4dCXDlstZthj99Pxdv1YKGv0WVUw'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzF6xtcKDUpQK_EP7mx5A9h8PnRVNAdDmqPrgNFJycb5xJ__lXzUpHhMdJBDefVZEZnjEH8LuDwHTe1KDbNRPLMmtANtEqAOAgQWQ-grZXQaNdRgGp_Hc3ENICDWSiz0MpcQRRsL7BD0L7S4kwAo7cJR7tatVUOyRf2Y8Cz0-8kyL4x9XfxQsDJmmL6fNM_TokEnnIj6Wenf3KZrHBlHJmnLJTzTRMLyd4tU6u3X7wU49xRXMFzkoGkArtE9oLY41JXY-GBxWVFmk'
    })
    setRoleState(selectedRole)
    setIsLoggedIn(true)
    localStorage.setItem('unilib_isLoggedIn', 'true')
    localStorage.setItem('unilib_role', selectedRole)
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.setItem('unilib_isLoggedIn', 'false')
  }

  const setRole = (selectedRole: UserRole) => {
    setRoleState(selectedRole)
    localStorage.setItem('unilib_role', selectedRole)
  }

  // Dynamic Catalog Database
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('unilib_books')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: '1',
        title: 'The Elements of Computing Systems',
        subtitle: 'Building a Modern Computer from First Principles',
        author: 'Noam Nisan, Shimon Schocken',
        category: 'Computer Science',
        floor: 'Floor 2',
        shelf: 'CS-102',
        status: 'available',
        rating: 4.5,
        reviewsCount: 128,
        published: '2005 (MIT Press)',
        isbn: '9780262640688',
        description: 'This textbook provides an integrated and rigorous introduction to computer science, building a complete hardware platform and software hierarchy from the ground up. Students will learn how to design logic gates, build a CPU, develop an assembler, a virtual machine, a compiler, and finally, a basic operating system, gaining a profound understanding of how computers actually work.',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3JQfZ_QbE9leqfjx-V1cl6sqGpO3QrGUTvYKRLz7lir7yOa-2QyHwFwVzEpm5SOZAJdFL3tOlcjzbTlUi5frw4IWfmZgWgHClETF9SZrG5qc9vpT0MEeRToeD0vbV-Nmhb2GcUVEp9tjs1yfc0P-yzOGH1LYGziILUqgnBmAHbGSDrDzEmiuDMdeFdeqyaYN5aMqXF6vHbicsngF3KZnmdefsNtl_JprjhLybQZjcBMmKBYQeGMT4DCCulPwajNQQPWrn2X4-lrE',
        coverAlt: 'Textbook cover of The Elements of Computing Systems showing circuit patterns.'
      },
      {
        id: '2',
        title: 'A Brief History of Time',
        subtitle: 'From the Big Bang to Black Holes',
        author: 'Stephen Hawking',
        category: 'Science & Math',
        floor: 'Floor 3',
        shelf: 'PHYS-204',
        status: 'checked-out',
        dueDate: 'Oct 12, 2026',
        rating: 5.0,
        reviewsCount: 512,
        published: '1988 (Bantam Books)',
        isbn: '9780553380163',
        description: 'A landmark volume in science writing by one of the great minds of our time, Stephen Hawking’s book explores the most profound questions of cosmology: How did the universe begin? What is time? Will it ever come to an end? Written for the general reader, it demystifies quantum mechanics, general relativity, and the origin of space and time.',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhLnJzkDNMaiTQBp5QcbkhZQK_0jw6ZFrhv0Dxsec7FmM_BA0hl8B9BCaBtQVV4s4lvdrzGAGIfxDBgImNx-1LrHA1H4CMgfO1sjQJRXBrFlZu696DSRtMXTAw3Elh-I3olyk3HLXykkxGFT8d9Zk52G9f6onQQ50wZFkn-7ljnD7W3kBsEE3buwvIKN6knwXYkGuLkMNlxN4C_CEAp-FPNEC6d8dzwkMzH5i-wVGdc0zhvH9Lpyh3NEOkAxb180JPBlf5_Cm8ffk',
        coverAlt: 'Book cover of A Brief History of Time depicting outer space.'
      },
      {
        id: '3',
        title: 'The Design of Everyday Things',
        subtitle: 'Why design matters for humans',
        author: 'Don Norman',
        category: 'Arts & Design',
        floor: 'Floor 1',
        shelf: 'DSN-84',
        status: 'available',
        rating: 4.0,
        reviewsCount: 84,
        published: '2013 (Basic Books)',
        isbn: '9780465050659',
        description: 'Even the smartest among us can feel inept as we try to figure out which light switch or oven burner to turn on, or whether to push, pull, or slide a door. Don Norman’s classic guide shows how usability can be achieved through deliberate design choices that guide the user’s actions naturally without instruction.',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEP_qp6th3i2112lrD9gj1xuYWvX24IzgMCAztXQYCxXxlpisF9pjNPjR9aA7LDaQmhLEziIanPHLXBLuhfcNWhVPHb27Bpp53Oo5-kwazVV2Uw0u3Yybis1WDKEx86UKG2aZ_k8QTFzNycSYqotmTVzXKegM3hhhBHxqARHNb3T7YsxvNMy8mBGVcGoScRlEZAt6a2reLEKNRidXdlENM2IJdumVmygKWS964vtkPFuc4x0k4fSv24-dP9BPWABfsgeE1SEdVp68',
        coverAlt: 'Minimalist cover of The Design of Everyday Things with an unusable teapot.',
        aiMatch: true
      },
      {
        id: '4',
        title: 'The Dispossessed',
        subtitle: 'An Ambiguous Utopia',
        author: 'Ursula K. Le Guin',
        category: 'Literature',
        floor: 'Floor 3',
        shelf: 'FIC-LEGU',
        status: 'available',
        rating: 4.8,
        reviewsCount: 154,
        published: '1974 (Harper & Row)',
        isbn: '9780061054884',
        description: 'Set in the same fictional universe as Le Guin’s other Hainish cycle novels, this science fiction classic contrasts a capitalistic planetary state with its anarchic, resource-scarce moon colony, exploring ecological themes, administrative hierarchies, and the human search for freedom.',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOxUTo5iJcEtKGodi5LSxBxaud5_XDeOvdzGWL2n-1xZEdf2v29nE27vV96CwrwfVSMqsbjekyasd-lZuFHACRGz09N3SVDveH926FO0EMM3okf7qT9i2KPfYggh8maAjVnikKeQgwRvaIl5AhzNgGEKV0s38dXgvBzuEiSws7cxAlAmvhSAdwQ2kphWrV6IuDgjrvlGbIR6FxMvYE-wMUaQFusrU63ycRH2r9kuVni8jX04zRcCIZqdhVxlRg8mk1ViwLBRmh0uY',
        coverAlt: 'Cover of The Dispossessed portraying a desert landscape.',
        aiMatch: true
      },
      {
        id: '5',
        title: 'Red Mars',
        subtitle: 'The colonization of the red planet',
        author: 'Kim Stanley Robinson',
        category: 'Literature',
        floor: 'Floor 3',
        shelf: 'FIC-ROBI',
        status: 'checked-out',
        dueDate: 'Oct 12, 2026',
        rating: 4.4,
        reviewsCount: 92,
        published: '1992 (Spectra Books)',
        isbn: '9780553560732',
        description: 'For centuries, the red planet has beckoned to mankind. Now, a team of one hundred scientists landing on Mars begins terraforming the planet, facing political tensions, corporate sabotage, and ecological concerns that divide the community.',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBspqHOqMRyXUYILbdikkzXqLzHkXWhhoL8ea8k3lH60ISsgm5r0KnxKuQPFCW6Ho7oCJbsDvd-8X8D3D9GJ32ePyOhR0NG7AvS_FoucD_fdC-arhDa-Jhl4CpUkTn_KElTrOdVLozQBtyOTx3zftQAY1cL6MiM_XNBirPzHgnwNv-2Sc6Zd0OOOrZrulb2E2Y18gWkVrlftQnjOXs_DCS_AwIHM3EiAso2cNC81CDYSEmo9BdKoMYC69JdbSIqpWuk5xQLCfEV0uE',
        coverAlt: 'Cover of Red Mars featuring topographical planetary lines.'
      },
      {
        id: '6',
        title: 'Foundation',
        subtitle: 'The classic saga of a galactic empire',
        author: 'Isaac Asimov',
        category: 'Literature',
        floor: 'Floor 3',
        shelf: 'FIC-ASIM',
        status: 'available',
        rating: 4.6,
        reviewsCount: 320,
        published: '1951 (Gnome Press)',
        isbn: '9780553293357',
        description: 'The first novel in Asimov’s seminal Foundation Trilogy, this cosmic epic follows psychohistorian Hari Seldon as he predicts the fall of the Galactic Empire and creates a sanctuary to preserve humanity’s collective knowledge through the dark ages.',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyzdgoPAmz4k7tQTYtSJh9Qpv64MEzcrY91_IsDHueMuNhzbF1D4eUI5u8VcSBFaQ2j_rr8owqAu-PpMHNjtmnU_mK67ZjNZkU8cNHOM0smS8mFdzGjEeTAxoiA-_apak84tRtAJaTD54ouNbi8SPZ3ujfFj66UzoqUoyqXrH2Inl8p4W_fQZz0g1CBjCAQshtV6TWXFOu8kYHtRLkoGKWiEWk5x3IpG5orNY4pD8wjZMvicTvRcm75M5N1-iPnPztCQcyupVGr30',
        coverAlt: 'Spaceship artwork for the Foundation cover.'
      }
    ]
  })

  // Synchronize catalog
  useEffect(() => {
    localStorage.setItem('unilib_books', JSON.stringify(books))
  }, [books])

  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Dynamic user loans list
  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('unilib_loans')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'L1',
        bookId: '2',
        title: 'The Structure of Scientific Revolutions',
        author: 'Thomas S. Kuhn',
        dueDate: 'Oct 26, 2026',
        status: 'due-soon',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpneiPmk0R7UtfwpWQIumvcAXX7mxu6RppyBMVR6pUQKigTbFvPhRwhWKu4-rS7l5exa_MW1YS-AB8H_e8F0DzF4CJAKYas0hpRqhHSb_cQfPcoN8kUjqfC9ChsppGYAZunlU5RG-Az2CTxQTreRWh9oTcwsKm4CW7hwcZavh8FBKH7eW2mHVJPT2c-A-u8WY3V9w1Iqk-4QAAOmiFwvwl4-Ju6LoN_crMEbeP8uk8L0LDV1cN9jV9KAiZjUi2dykBB6aCP2DyWUg',
        coverAlt: 'Cover of Scientific Revolutions with geometric academic vectors.'
      },
      {
        id: 'L2',
        bookId: '5',
        title: 'Advanced Macroeconomics',
        author: 'David Romer',
        dueDate: 'Nov 15, 2026',
        status: 'on-track',
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvD1KupNwi1XH53HW4Ugcz3NTaW6RPYjbcLuJ-C2DzeJvnFGVDbWapIhhJwOPlJJ4ysgWBSt8Mkn_MJNO_Ce4rWRR7pvpcIhiPYUUWTmPqiUkLpMo45aiwGoW8GC9r0qt_n2wut-1UURdaqfuTw0zjp_NIU4Pe3lLH8ujlyXlJgZb4lEC-AYEfllChJ1QXdezEVJOcDfWUhPqdjQuJoz2-WVBquJ0VVNPVroNalgiMC5AbAlwyiOerooTRnpKpzc5vI-6Oec0iFMA',
        coverAlt: 'Macroeconomics cover with graphs.'
      },
      {
        id: 'L3',
        bookId: '3',
        title: 'Digital Design & Computer Arch.',
        author: 'David Harris',
        dueDate: 'Nov 18, 2026',
        status: 'on-track',
        coverUrl: '', // Will render placeholder icon as in HTML code
        coverAlt: 'Icon placeholder cover'
      }
    ]
  })

  // Synchronize loans
  useEffect(() => {
    localStorage.setItem('unilib_loans', JSON.stringify(loans))
  }, [loans])

  // Historical log list
  const [loanHistory, setLoanHistory] = useState<LoanHistoryItem[]>(() => {
    const saved = localStorage.getItem('unilib_loanHistory')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'H1',
        title: 'Introduction to Algorithms',
        author: 'Cormen, Leiserson',
        returnedDate: 'Sep 12, 2026',
        status: 'Returned On Time'
      },
      {
        id: 'H2',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        returnedDate: 'Aug 05, 2026',
        status: 'Late (Paid)'
      }
    ]
  })

  // Synchronize historical log
  useEffect(() => {
    localStorage.setItem('unilib_loanHistory', JSON.stringify(loanHistory))
  }, [loanHistory])

  // Nigerian Naira (₦) Fines Outstanding charges
  const [fines, setFines] = useState<Fine[]>(() => {
    const saved = localStorage.getItem('unilib_fines')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'F1',
        type: 'Late Return',
        details: 'Clean Code (3 days)',
        amount: 150
      },
      {
        id: 'F2',
        type: 'Lost Item Replacement',
        details: 'Design Patterns (Processing)',
        amount: 1300
      }
    ]
  })

  // Synchronize fines
  useEffect(() => {
    localStorage.setItem('unilib_fines', JSON.stringify(fines))
  }, [fines])

  const totalFines = fines.reduce((sum, f) => sum + f.amount, 0)

  // Digital Resources
  const [resources, setResources] = useState<DigitalResource[]>(() => {
    const saved = localStorage.getItem('unilib_resources')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'R1',
        title: 'The Principles of Quantum Mechanics, 4th Ed.',
        author: 'P.A.M. Dirac',
        addedDate: 'Oct 12, 2025',
        fileSize: '12 MB',
        format: 'PDF',
        status: 'available',
        tags: ['Physics', 'Quantum mechanics'],
        isPublic: true
      },
      {
        id: 'R2',
        title: 'A History of Western Philosophy',
        author: 'Bertrand Russell',
        addedDate: 'Nov 05, 2025',
        fileSize: '4 MB',
        format: 'EPUB',
        status: 'reserved',
        tags: ['Philosophy', 'History'],
        isPublic: true
      },
      {
        id: 'R3',
        title: 'Structural Analysis Approaches in Modern Engineering',
        author: 'Various Authors',
        addedDate: 'Jan 15, 2026',
        fileSize: '18 MB',
        format: 'PDF',
        status: 'maintenance',
        tags: ['Engineering', 'Structural analysis'],
        isPublic: false
      },
      {
        id: 'R4',
        title: 'Introduction to Machine Learning Archives',
        author: 'Dept. of Computer Science',
        addedDate: 'Jan 22, 2026',
        fileSize: '8.5 MB',
        format: 'PDF',
        status: 'available',
        tags: ['Computer Science', 'Machine Learning'],
        isPublic: true
      }
    ]
  })

  // Synchronize resources
  useEffect(() => {
    localStorage.setItem('unilib_resources', JSON.stringify(resources))
  }, [resources])

  // Staff Requests Queue
  const [approvals, setApprovals] = useState<RequestApproval[]>(() => {
    const saved = localStorage.getItem('unilib_approvals')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'A1',
        requesterName: 'Prof. A. Jones',
        requesterInitials: 'AJ',
        requesterRole: 'Faculty',
        type: 'Interlibrary Loan Request',
        bookTitle: 'Fluid Mechanics'
      },
      {
        id: 'A2',
        requesterName: 'Student S. Miller',
        requesterInitials: 'SM',
        requesterRole: 'Student',
        type: 'Hold Request',
        bookTitle: 'The Republic'
      }
    ]
  })

  // Synchronize approvals
  useEffect(() => {
    localStorage.setItem('unilib_approvals', JSON.stringify(approvals))
  }, [approvals])

  // Low Stock alerts
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(() => {
    const saved = localStorage.getItem('unilib_lowStockAlerts')
    if (saved) return JSON.parse(saved)
    return [
      {
        id: 'S1',
        title: 'The History of Rome',
        author: 'Theodor Mommsen',
        quantityLeft: 1,
        actionLabel: 'ORDER REPLACEMENT'
      },
      {
        id: 'S2',
        title: 'Principles of Physics',
        author: 'Halliday & Resnick',
        quantityLeft: 0,
        actionLabel: 'RUSH ORDER'
      },
      {
        id: 'S3',
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        quantityLeft: 2,
        actionLabel: 'REVIEW STOCK'
      }
    ]
  })

  // Synchronize alerts
  useEffect(() => {
    localStorage.setItem('unilib_lowStockAlerts', JSON.stringify(lowStockAlerts))
  }, [lowStockAlerts])

  // Notifications
  const [notifications, setNotifications] = useState<{ id: string; text: string; read: boolean; date: string }[]>([
    { id: 'n1', text: "Your loan for 'Scientific Revolutions' is due in 3 days.", read: false, date: 'Oct 23, 2026' },
    { id: 'n2', text: "Librarian approved hold request for 'Design of Everyday Things'.", read: false, date: 'Oct 20, 2026' }
  ])

  // AI Assistant Chat Messages
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'c1', sender: 'ai', text: 'Greetings, scholar. I am the Campus Shelf AI research assistant. How may I guide your studies today?', timestamp: new Date() }
  ])

  // Shared statistics derived automatically
  const [analyticsMetrics, setAnalyticsMetrics] = useState({
    totalItems: '1,204,582',
    activeLoansCount: loans.length + 45889, // base off screenshot mock data (e.g. 45892)
    overdueItemsCount: 3421,
    finesCollected: '$12.4k',
    borrowingTrends: [40, 60, 85, 50, 70, 90, 65]
  })

  useEffect(() => {
    const baseCount = 1204582 - 6; // base total items minus the 6 initial books
    const total = baseCount + books.length;
    setAnalyticsMetrics(prev => ({
      ...prev,
      totalItems: total.toLocaleString(),
      activeLoansCount: loans.length + 45889
    }))
  }, [loans, books])

  // Action methods
  const borrowBook = (bookId: string) => {
    const updatedBooks = books.map(b => b.id === bookId ? { ...b, status: 'checked-out' as const, dueDate: 'Nov 12, 2026' } : b)
    setBooks(updatedBooks)

    const targetBook = books.find(b => b.id === bookId)
    if (targetBook) {
      const newLoan: Loan = {
        id: `L${Date.now()}`,
        bookId: targetBook.id,
        title: targetBook.title,
        author: targetBook.author,
        dueDate: 'Nov 12, 2026',
        status: 'on-track',
        coverUrl: targetBook.coverUrl,
        coverAlt: targetBook.coverAlt
      }
      setLoans(prev => [newLoan, ...prev])
      setNotifications(prev => [
        { id: `n_${Date.now()}`, text: `Successfully borrowed '${targetBook.title}'. Placed in your Loans checklist.`, read: false, date: 'Today' },
        ...prev
      ])
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook({ ...selectedBook, status: 'checked-out', dueDate: 'Nov 12, 2026' })
      }
    }
  }

  const reserveBook = (bookId: string) => {
    const updatedBooks = books.map(b => b.id === bookId ? { ...b, status: 'waitlisted' as const, waitlistCount: (b.waitlistCount || 0) + 1 } : b)
    setBooks(updatedBooks)

    const targetBook = books.find(b => b.id === bookId)
    if (targetBook) {
      setNotifications(prev => [
        { id: `n_${Date.now()}`, text: `Placed a reserve hold on '${targetBook.title}'. You are in the waitlist.`, read: false, date: 'Today' },
        ...prev
      ])
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook({ ...selectedBook, status: 'waitlisted', waitlistCount: (selectedBook.waitlistCount || 0) + 1 })
      }
    }
  }

  const renewLoan = (loanId: string) => {
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          dueDate: 'Dec 15, 2026',
          status: 'on-track' as const
        }
      }
      return l
    }))
    setNotifications(prev => [
      { id: `n_${Date.now()}`, text: 'Loan renewed successfully. Due date extended.', read: false, date: 'Today' },
      ...prev
    ])
  }

  const payFinesWithPaystack = () => {
    // Settle outstanding balances
    setFines([])
    setLoanHistory(prev => prev.map(h => h.status === 'Late (Outstanding)' ? { ...h, status: 'Late (Paid)' as const } : h))
    setNotifications(prev => [
      { id: `n_${Date.now()}`, text: 'Late fines paid in full via Paystack. Balance cleared.', read: false, date: 'Today' },
      ...prev
    ])
    setIsPaystackOpen(false)
  }

  const uploadResource = (title: string, author: string, tags: string[], isPublic: boolean, fileFormat: 'PDF' | 'EPUB', fileSize: string) => {
    const newRes: DigitalResource = {
      id: `R${Date.now()}`,
      title,
      author: author || 'Unknown Creator',
      addedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      fileSize,
      format: fileFormat,
      status: 'available',
      tags: tags.length > 0 ? tags : ['Philosophy'],
      isPublic
    }
    setResources(prev => [newRes, ...prev])
    setNotifications(prev => [
      { id: `n_${Date.now()}`, text: `Digital resource '${title}' uploaded to repository.`, read: false, date: 'Today' },
      ...prev
    ])
    setIsUploadModalOpen(false)
  }

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id))
  }

  const toggleResourceVisibility = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, isPublic: !r.isPublic } : r))
  }

  const approveRequest = (id: string) => {
    const targetApproval = approvals.find(a => a.id === id)
    setApprovals(prev => prev.filter(a => a.id !== id))
    
    if (targetApproval) {
      setNotifications(prev => [
        { id: `n_${Date.now()}`, text: `Approved ${targetApproval.type} for '${targetApproval.bookTitle}'.`, read: false, date: 'Today' },
        ...prev
      ])
      // If it's a hold request for The Republic, check it out or make it available
      if (targetApproval.bookTitle === 'The Republic') {
        // Mock borrow
      }
    }
  }

  const rejectRequest = (id: string) => {
    const targetApproval = approvals.find(a => a.id === id)
    setApprovals(prev => prev.filter(a => a.id !== id))
    if (targetApproval) {
      setNotifications(prev => [
        { id: `n_${Date.now()}`, text: `Rejected ${targetApproval.type} for '${targetApproval.bookTitle}'.`, read: false, date: 'Today' },
        ...prev
      ])
    }
  }

  const orderRestock = (alertId: string) => {
    setLowStockAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          quantityLeft: a.quantityLeft + 5 // Restocked!
        }
      }
      return a
    }))
    const alertItem = lowStockAlerts.find(a => a.id === alertId)
    if (alertItem) {
      setNotifications(prev => [
        { id: `n_${Date.now()}`, text: `Stock reorder processed for '${alertItem.title}'.`, read: false, date: 'Today' },
        ...prev
      ])
    }
  }

  const addCatalogueBook = (
    title: string,
    subtitle: string,
    author: string,
    category: string,
    floor: string,
    shelf: string,
    published: string,
    isbn: string,
    description: string,
    coverUrl: string
  ) => {
    const newBook: Book = {
      id: `book_${Date.now()}`,
      title,
      subtitle: subtitle || undefined,
      author,
      category: category || 'General',
      floor: floor || 'Floor 1',
      shelf: shelf || 'GEN-101',
      status: 'available',
      rating: 5.0,
      reviewsCount: 0,
      published: published || '2026',
      isbn: isbn || '978-0000000000',
      description: description || 'No summary description available.',
      coverUrl: coverUrl || '',
      coverAlt: `Book cover of ${title}`
    }
    setBooks(prev => [newBook, ...prev])
    setNotifications(prev => [
      { id: `n_${Date.now()}`, text: `Cataloged new physical volume: '${title}' by ${author}.`, read: false, date: 'Today' },
      ...prev
    ])
    setIsNewBookModalOpen(false)
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, sender: 'user', text, timestamp: new Date() }
    setChatHistory(prev => [...prev, userMsg])

    // Generate smart context-aware mock AI response
    setTimeout(() => {
      let aiText = "I have searched the catalog archives, but didn't find direct matches. You can check the digital catalog under 'Catalogue'."
      const lower = text.toLowerCase()

      if (lower.includes('due') || lower.includes('return') || lower.includes('loan')) {
        const soonLoan = loans.find(l => l.status === 'due-soon')
        if (soonLoan) {
          aiText = `According to your active loans records, your check-out of '${soonLoan.title}' by ${soonLoan.author} is due soon on **${soonLoan.dueDate}**. Would you like me to renew it for you?`
        } else if (loans.length > 0) {
          aiText = `You currently have **${loans.length} active loans**. The earliest deadline is **${loans[0].dueDate}** for '${loans[0].title}'. You can renew items under 'My Books'.`
        } else {
          aiText = "You have no active physical loans. Are you looking to borrow any specific texts today?"
        }
      } else if (lower.includes('fine') || lower.includes('debt') || lower.includes('naira') || lower.includes('money')) {
        if (totalFines > 0) {
          aiText = `You have an outstanding late fee balance of **₦${totalFines.toLocaleString()}** stemming from: ${fines.map(f => `\n- ${f.type} (${f.details})`).join('')}\n\nYou can pay securely with Paystack from the 'My Books' panel.`
        } else {
          aiText = "Your financial balance is completely clear. No outstanding fees are associated with your university credential."
        }
      } else if (lower.includes('dune') || lower.includes('sci-fi') || lower.includes('ecology') || lower.includes('recommend')) {
        aiText = "Based on your request, I recommend **The Dispossessed** by Ursula K. Le Guin (Floor 3, Shelf FIC-LEGU) or **Red Mars** by Kim Stanley Robinson. Both explore complex resource politics, societal engineering, and ecological survival."
      } else if (lower.includes('algorithms') || lower.includes('computer') || lower.includes('principles')) {
        aiText = "We have **The Elements of Computing Systems** by Nisan and Schocken available on Floor 2, Shelf CS-102. It covers computing hardware from logic gates to operating systems."
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        aiText = `Hello, ${userProfile.name.split(' ')[0]}! I am ready to locate manuscripts, calculate fine tallies, or suggest research materials. What subject are you pursuing today?`
      } else if (lower.includes('help') || lower.includes('librarian')) {
        aiText = "You can search the digital book collections under 'Catalogue', track return schedules under 'My Books', access PDF downloads in 'Research', or request librarian support."
      }

      const aiMsg: ChatMessage = { id: `ai_${Date.now()}`, sender: 'ai', text: aiText, timestamp: new Date() }
      setChatHistory(prev => [...prev, aiMsg])
    }, 800)
  }

  return (
    <LibraryContext.Provider value={{
      isLoggedIn,
      role,
      theme,
      userProfile,
      login,
      logout,
      setRole,
      toggleTheme,
      books,
      selectedBook,
      setSelectedBook,
      borrowBook,
      reserveBook,
      loans,
      loanHistory,
      fines,
      totalFines,
      renewLoan,
      payFinesWithPaystack,
      isPaystackOpen,
      setIsPaystackOpen,
      resources,
      uploadResource,
      deleteResource,
      toggleResourceVisibility,
      isUploadModalOpen,
      setIsUploadModalOpen,
      approvals,
      lowStockAlerts,
      approveRequest,
      rejectRequest,
      orderRestock,
      analyticsMetrics,
      notifications,
      clearNotifications,
      isAIAssistantOpen,
      setIsAIAssistantOpen,
      chatHistory,
      sendChatMessage,
      addCatalogueBook,
      isNewBookModalOpen,
      setIsNewBookModalOpen
    }}>
      {children}
    </LibraryContext.Provider>
  )
}

export const useLibrary = () => {
  const context = useContext(LibraryContext)
  if (!context) throw new Error('useLibrary must be used inside a LibraryProvider')
  return context
}
