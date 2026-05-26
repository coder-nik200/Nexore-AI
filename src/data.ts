import { Task, Project, ActivityItem } from './types';

export const AVATARS = {
  nitish: '/images/Nitish.png',
  alexRivera: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YuCjShUq_my5jQ7Iplt3T0lKYKQrBjQkqQ1orkVOJirGgxx4AdDXvLcXAedkKl89E0N62HUE5Y3IZHIPDJhjjxoeU3P_TZSu9vPyJuAENQt5MtlBl4Jy2ddoZf4jxX__TMVrJ_BaPyhF-oz8EfjjocCRKS24Cz9W8imktM--gzPYAaO07h8apseAtgdTwDsZuEIcDBu-XbgVaVEewJmTGyhoA_VF0OGBTHga_bDKWedRvu6CtjJl2ViyxGwipDpHCWI75s6y2H1P', 
  head1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL0T3215Uj44yjORFbU_OsQFp1DMHdt4fy7vI8-AOxjwAE4g8TYregdU0xrqx5I1l2eH-pOo8r-adXG8V3gI50o555dmBGRy7jFvQHkUchMYAh9w3lYin6tupJfL9-OoGv_dFiXNR1wUtyeGZtqt41qtMU7Bp9q9JObz5JfIiCKU4Xx0y0Sm9hJ60cLNHrXcbIn6svTqdOHX8tDRHksp88r3OkVI4gIL0cP1xfIzBRIV2EN-eadZ0K0Jco3qDxQsv0vwbS3sNv2nrL',
  head2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK_fCpATCs-_ir25upAxfk1i2G8jbJ5XROFRgIlM_A-aqZWC-V8__2ZBrVMJwqAoNnB51lF22pK342kzourclAb93wIr3Ss4Kh9svshA8hPvKHRRX6lZuxQ28AtwSyc5EK10i12ZsCQK3oLs8CIZTxRHu4pBaAAS1wUzW9piXXXDKpR5nCkB2mZxVZC_mlkyOp2Nw88TppXI6e_ned79-Oaaccq-RLqxQZ_5pn5Iukf5t7FgqKJJbPfSqG1euzGt20m8UokliVL9dZ',
  head3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIYOATR2aEx1KWFk8TvnJZaxiepAtQAefg6F-2k8eBsxVOZq1PruZzOgsLIdjflVJAnxhZNOP7mAHdFBWB80QrYeonKbZtBl7XM4Fw3BGgRYobXoDNpvzHNWUOGP_63WwCNcaWutg_fNj-CYIoT3XXkaDeYAW8h-kMRZ6kqXQshaasQgWDkOIOgUgh20R8CgP8O9PbZhnHaucgm2zXCJLIA-EDqG3ICOl257RIKNs4R_8JrGUgYIRqvVZ12q8tzDkFEwMXCGes0uiP',
  head4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtAJVXbmD62AWPxubtLXIijAs2DMQA0LeuaecIUUFHB39bjEiUaoLz-19T0jvavNwxywkeUNW9ZTL5k0FC1cFnm4jAeO1S3CWK1P0ZBbxHqRifpXN7y4RX9tMvEl6KSytnBjdBfQc4vvYJdV8Hjf3vuIxoVADWWp783NYBpFL3tgNIxBo8KiJuoxQid7jbuJl5WdEM4KgcDsdemgL4bezDXVv55vOwKW5Eq6FKqCc091wfoYts7gAvSds8y9r7n4QaSe7CjQKb56I0',
  head5: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAInNF13FchFgZAyEP5Qk1TicwPXnXGdcvuwfpcuFKlIKUG-XK5KgS0ZjhwVbrOx-agpq_UOfY0yqxf2ZrnzgB5MuSsPpC1gzv_YNbE9Bc3ByFugy4qsDzTogWBjgm1qqieiEDoEUE1qf0UoSJqJW8XFuyz6Md8Z8aEyq_F_SE-X0fr4c6aRMcJgA3MowVrmkqr2enPMtRcJLgnmrrlL4yjREKuPdexXCfVreJL_qsYfIYRUZE92iCxLqrNBE879c5vP5Om6JMILvvf',
  head6: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYSP16DuBH5lZ-qAgzaBIusmYaewjvmi_0TyDyWbkLScSkySNDj9jOwb7iQpPgkGfZXf_WvEOgw7eRUMAz79VwmZA71pihyUfHvNUJ7HZWn0vgcEX55yUtejK2oipcMnpkhF4nOTIOvM5-5a6ZLXMut11keGrkvl46fHw2wiJ5O1BYEbLscMGVxLa7nM_4Q9MXvkMXWE6saYP1hKouO2M53ToqSO3sBNXY1Ja4dN-zPfJwOB7sSAz8WYYu4FS_MoXgyq0jZerEZ-Bm',
  head7: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDBJ5GMDkJCo4IsAUE6D9UpTd9GAQI_RnQfQbTK9nOUZV_aM7v3jOKo-0gPsykLqWlPOSKvphXg2NyFbphLxjC6xdWWA7VcbqwJtNkrl8P0LXEJZTmulWIcMH17vMYpAguFun9ubkzmt1r9ulj0tK-JnsKvdDaRISmJzj4V3Hhemyvy06WQTFmAorV07gqHex2AAa6yg7B3TizUk-j-KaAcU0XqUNgQ-Zjh5R7YDpcyhDpp7cOdXyWSnN7N9qpg2UhcabHePTz2Hv5',
  head8: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLbR_tGrTH1tOcOgY7EnB255YSPGF5Bd_XJtwmRusxhpBtMsHuppiJ3QLlZbvxGATL1dCJ_Nj_nJChzfxkum3YmYw_Qe1b07ktaK9W5HXCkw_k0vl8BcBCh_DRRMNzG80fmfe4DpKUPfBgCszDMPeuQ74edWOwIlUhA9CW2ID3F0SfVQ1bKyH67qDC9nOTIQiTckmUdOZ8gplmAQYDx1UoDbwxNfjPKX7uxOslxjqfD0fh0u95lpQhRiWbL8PG7swrdgsPhW6CVjAC',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Nexora Visual Engine 2.0',
    category: 'R&D / High Performance Computing',
    progress: 78,
    status: 'On Track',
    team: [
      { name: 'Developer A', avatar: AVATARS.head1 },
      { name: 'PM B', avatar: AVATARS.head2 },
      { name: 'Senior C', avatar: AVATARS.head3 },
    ],
    icon: 'rocket_launch'
  },
  {
    id: 'p2',
    name: 'Security Audit Protocols',
    category: 'Compliance / Internal Tools',
    progress: 34,
    status: 'Delayed',
    team: [
      { name: 'Analyst D', avatar: AVATARS.head4 },
      { name: 'Writer E', avatar: AVATARS.head5 },
    ],
    icon: 'shield'
  },
  {
    id: 'p3',
    name: 'Client API Integration Shell',
    category: 'External / Middleware',
    progress: 100,
    status: 'Completed',
    team: [
      { name: 'API Dev F', avatar: AVATARS.head6 },
    ],
    icon: 'hub'
  },
  {
    id: 'p4',
    name: 'Neural Engine v2.4',
    category: 'Active Workspace / Transformers',
    progress: 52,
    status: 'On Track',
    team: [
      { name: 'Alex Rivera', avatar: AVATARS.alexRivera },
      { name: 'Nitish Bharti', avatar: AVATARS.nitish },
      { name: 'Mahima', avatar: AVATARS.head7 },
      { name: 'Sam', avatar: AVATARS.head8 },
    ],
    icon: 'smart_toy'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Benchmarking Latency',
    description: 'Test inference speeds across Snapdragon 8 Gen 3 devices.',
    status: 'todo',
    category: 'RESEARCH',
    priority: 'high',
    assignees: [
      { name: 'Mahima', avatar: AVATARS.head7 }
    ],
    commentsCount: 2
  },
  {
    id: 't2',
    title: 'Pruning Strategy Refinement',
    description: 'Determine optimal sparsity constraints based on transformer validation tests.',
    status: 'todo',
    category: 'AI SUGGESTED',
    priority: 'low',
    isAISuggested: true,
    subtasks: [
      { text: 'Analyze sparsity patterns', completed: true },
      { text: 'Validate loss convergence', completed: false }
    ],
    assignees: [
      { name: 'Alex Rivera', avatar: AVATARS.alexRivera }
    ]
  },
  {
    id: 't3',
    title: 'Refactor Quantization Module',
    description: 'Port quantization logic to C++ bindings to optimize execution speeds on edge devices.',
    status: 'inprogress',
    category: 'ENGINEERING',
    priority: 'high',
    progress: 65,
    assignees: [
      { name: 'Sam', avatar: AVATARS.head8 }
    ]
  },
  {
    id: 't4',
    title: 'Dashboard Visual Polish',
    description: 'Reviewing glassmorphism effects and accessibility contrast ratios.',
    status: 'review',
    category: 'DESIGN',
    priority: 'medium',
    listAttachment: 'Design_Specs_v2.fig',
    assignees: [
      { name: 'Nitish Bharti', avatar: AVATARS.nitish }
    ]
  },
  {
    id: 't5',
    title: 'CI/CD Pipeline Setup',
    description: 'Setting up GitHub Actions pipeline for auto-compiling core libraries.',
    status: 'done',
    category: 'INFRA',
    priority: 'medium',
    assignees: [
      { name: 'PM B', avatar: AVATARS.head2 }
    ]
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1',
    type: 'ai',
    icon: 'auto_fix_high',
    message: 'AI Agent Alpha optimized task distribution for Project Orion.',
    time: '12 minutes ago'
  },
  {
    id: 'a2',
    type: 'user',
    icon: 'person_add',
    message: 'Sarah Connor joined the Core Infrastructure team.',
    time: '2 hours ago'
  },
  {
    id: 'a3',
    type: 'milestone',
    icon: 'check_circle',
    message: 'Milestone Reached: Beta Deployment of Nexora v2.1 successful.',
    time: '5 hours ago'
  }
];
