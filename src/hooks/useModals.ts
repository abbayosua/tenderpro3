'use client';

import { useState, useCallback } from 'react';
import type { Contractor, Project, Milestone } from '@/types';

interface SelectedProjectForProgress {
  id: string;
  title: string;
  category: string;
  budget: number;
}

interface SelectedProjectForCCTV {
  id: string;
  title: string;
  status: string;
}

interface UseModalsReturn {
  // Login modal
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  loginRole: 'OWNER' | 'CONTRACTOR';
  setLoginRole: (role: 'OWNER' | 'CONTRACTOR') => void;
  openLogin: () => void;
  closeLogin: () => void;

  // Register modal
  registerOpen: boolean;
  setRegisterOpen: (open: boolean) => void;
  registerRole: 'OWNER' | 'CONTRACTOR';
  setRegisterRole: (role: 'OWNER' | 'CONTRACTOR') => void;
  registerStep: number;
  setRegisterStep: (step: number) => void;
  registerLoading: boolean;
  setRegisterLoading: (loading: boolean) => void;
  openRegister: (role?: 'OWNER' | 'CONTRACTOR') => void;
  closeRegister: () => void;

  // Bid modal
  showBidModal: boolean;
  setShowBidModal: (show: boolean) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  bidProposal: string;
  setBidProposal: (proposal: string) => void;
  bidPrice: string;
  setBidPrice: (price: string) => void;
  bidDuration: string;
  setBidDuration: (duration: string) => void;
  openBidModal: (project: Project) => void;
  closeBidModal: () => void;

  // Verification modal
  showVerificationModal: boolean;
  setShowVerificationModal: (show: boolean) => void;
  docType: string;
  setDocType: (type: string) => void;
  docName: string;
  setDocName: (name: string) => void;
  openVerificationModal: () => void;
  closeVerificationModal: () => void;

  // Create project modal
  showCreateProjectModal: boolean;
  setShowCreateProjectModal: (show: boolean) => void;
  newProject: {
    title: string;
    description: string;
    category: string;
    location: string;
    budget: string;
    duration: string;
    requirements: string;
  };
  setNewProject: (project: UseModalsReturn['newProject']) => void;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;

  // Compare bids modal
  showCompareModal: boolean;
  setShowCompareModal: (show: boolean) => void;
  selectedBidsForCompare: string[];
  setSelectedBidsForCompare: (bids: string[]) => void;
  toggleBidSelection: (bidId: string) => void;
  openCompareModal: () => void;
  closeCompareModal: () => void;

  // Progress modal
  showProgressModal: boolean;
  setShowProgressModal: (show: boolean) => void;
  selectedProjectForProgress: SelectedProjectForProgress | null;
  setSelectedProjectForProgress: (project: SelectedProjectForProgress | null) => void;
  milestones: Milestone[];
  setMilestones: (milestones: Milestone[]) => void;
  progressPercent: number;
  setProgressPercent: (percent: number) => void;
  openProgressModal: (project: SelectedProjectForProgress) => void;
  closeProgressModal: () => void;

  // CCTV modal
  showCCTVModal: boolean;
  setShowCCTVModal: (show: boolean) => void;
  selectedProjectForCCTV: SelectedProjectForCCTV | null;
  setSelectedProjectForCCTV: (project: SelectedProjectForCCTV | null) => void;
  cctvIsPlaying: boolean;
  setCctvIsPlaying: (playing: boolean) => void;
  selectedCamera: number;
  setSelectedCamera: (camera: number) => void;
  openCCTVModal: (project: SelectedProjectForCCTV) => void;
  closeCCTVModal: () => void;

  // Export modal
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  exportFormat: 'pdf' | 'excel';
  setExportFormat: (format: 'pdf' | 'excel') => void;
  openExportModal: () => void;
  closeExportModal: () => void;

  // All bids modal
  showAllBidsModal: boolean;
  setShowAllBidsModal: (show: boolean) => void;
  openAllBidsModal: () => void;
  closeAllBidsModal: () => void;

  // Contractor detail modal
  selectedContractor: Contractor | null;
  setSelectedContractor: (contractor: Contractor | null) => void;
  openContractorDetail: (contractor: Contractor) => void;
  closeContractorDetail: () => void;

  // Reset all modals
  resetAllModals: () => void;
}

const DEFAULT_NEW_PROJECT = {
  title: '',
  description: '',
  category: 'Pembangunan Baru',
  location: '',
  budget: '',
  duration: '',
  requirements: '',
};

export function useModals(): UseModalsReturn {
  // Login modal state
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<'OWNER' | 'CONTRACTOR'>('OWNER');

  // Register modal state
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerRole, setRegisterRole] = useState<'OWNER' | 'CONTRACTOR'>('OWNER');
  const [registerStep, setRegisterStep] = useState(1);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Bid modal state
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [bidProposal, setBidProposal] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [bidDuration, setBidDuration] = useState('');

  // Verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [docType, setDocType] = useState('KTP');
  const [docName, setDocName] = useState('');

  // Create project modal state
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProject, setNewProject] = useState(DEFAULT_NEW_PROJECT);

  // Compare bids modal state
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedBidsForCompare, setSelectedBidsForCompare] = useState<string[]>([]);

  // Progress modal state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedProjectForProgress, setSelectedProjectForProgress] = useState<SelectedProjectForProgress | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);

  // CCTV modal state
  const [showCCTVModal, setShowCCTVModal] = useState(false);
  const [selectedProjectForCCTV, setSelectedProjectForCCTV] = useState<SelectedProjectForCCTV | null>(null);
  const [cctvIsPlaying, setCctvIsPlaying] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(1);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf');

  // All bids modal state
  const [showAllBidsModal, setShowAllBidsModal] = useState(false);

  // Contractor detail modal state
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);

  // Login modal actions
  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  // Register modal actions
  const openRegister = useCallback((role?: 'OWNER' | 'CONTRACTOR') => {
    if (role) setRegisterRole(role);
    setRegisterOpen(true);
  }, []);
  const closeRegister = useCallback(() => {
    setRegisterOpen(false);
    setRegisterStep(1);
  }, []);

  // Bid modal actions
  const openBidModal = useCallback((project: Project) => {
    setSelectedProject(project);
    setShowBidModal(true);
  }, []);
  const closeBidModal = useCallback(() => {
    setShowBidModal(false);
    setBidProposal('');
    setBidPrice('');
    setBidDuration('');
  }, []);

  // Verification modal actions
  const openVerificationModal = useCallback(() => setShowVerificationModal(true), []);
  const closeVerificationModal = useCallback(() => {
    setShowVerificationModal(false);
    setDocName('');
  }, []);

  // Create project modal actions
  const openCreateProjectModal = useCallback(() => setShowCreateProjectModal(true), []);
  const closeCreateProjectModal = useCallback(() => {
    setShowCreateProjectModal(false);
    setNewProject(DEFAULT_NEW_PROJECT);
  }, []);

  // Compare modal actions
  const toggleBidSelection = useCallback((bidId: string) => {
    setSelectedBidsForCompare(prev =>
      prev.includes(bidId)
        ? prev.filter(id => id !== bidId)
        : prev.length < 3 ? [...prev, bidId] : prev
    );
  }, []);
  const openCompareModal = useCallback(() => setShowCompareModal(true), []);
  const closeCompareModal = useCallback(() => setShowCompareModal(false), []);

  // Progress modal actions
  const openProgressModal = useCallback((project: SelectedProjectForProgress) => {
    setSelectedProjectForProgress(project);
    setShowProgressModal(true);
  }, []);
  const closeProgressModal = useCallback(() => setShowProgressModal(false), []);

  // CCTV modal actions
  const openCCTVModal = useCallback((project: SelectedProjectForCCTV) => {
    setSelectedProjectForCCTV(project);
    setShowCCTVModal(true);
  }, []);
  const closeCCTVModal = useCallback(() => setShowCCTVModal(false), []);

  // Export modal actions
  const openExportModal = useCallback(() => setShowExportModal(true), []);
  const closeExportModal = useCallback(() => setShowExportModal(false), []);

  // All bids modal actions
  const openAllBidsModal = useCallback(() => setShowAllBidsModal(true), []);
  const closeAllBidsModal = useCallback(() => setShowAllBidsModal(false), []);

  // Contractor detail actions
  const openContractorDetail = useCallback((contractor: Contractor) => {
    setSelectedContractor(contractor);
  }, []);
  const closeContractorDetail = useCallback(() => setSelectedContractor(null), []);

  // Reset all modals
  const resetAllModals = useCallback(() => {
    setShowBidModal(false);
    setShowVerificationModal(false);
    setShowCreateProjectModal(false);
    setShowCompareModal(false);
    setShowProgressModal(false);
    setShowExportModal(false);
    setShowCCTVModal(false);
    setShowAllBidsModal(false);
    setSelectedContractor(null);
    setSelectedProject(null);
    setSelectedProjectForProgress(null);
    setSelectedProjectForCCTV(null);
    setLoginOpen(false);
    setRegisterOpen(false);
  }, []);

  return {
    // Login
    loginOpen,
    setLoginOpen,
    loginRole,
    setLoginRole,
    openLogin,
    closeLogin,

    // Register
    registerOpen,
    setRegisterOpen,
    registerRole,
    setRegisterRole,
    registerStep,
    setRegisterStep,
    registerLoading,
    setRegisterLoading,
    openRegister,
    closeRegister,

    // Bid
    showBidModal,
    setShowBidModal,
    selectedProject,
    setSelectedProject,
    bidProposal,
    setBidProposal,
    bidPrice,
    setBidPrice,
    bidDuration,
    setBidDuration,
    openBidModal,
    closeBidModal,

    // Verification
    showVerificationModal,
    setShowVerificationModal,
    docType,
    setDocType,
    docName,
    setDocName,
    openVerificationModal,
    closeVerificationModal,

    // Create project
    showCreateProjectModal,
    setShowCreateProjectModal,
    newProject,
    setNewProject,
    openCreateProjectModal,
    closeCreateProjectModal,

    // Compare
    showCompareModal,
    setShowCompareModal,
    selectedBidsForCompare,
    setSelectedBidsForCompare,
    toggleBidSelection,
    openCompareModal,
    closeCompareModal,

    // Progress
    showProgressModal,
    setShowProgressModal,
    selectedProjectForProgress,
    setSelectedProjectForProgress,
    milestones,
    setMilestones,
    progressPercent,
    setProgressPercent,
    openProgressModal,
    closeProgressModal,

    // CCTV
    showCCTVModal,
    setShowCCTVModal,
    selectedProjectForCCTV,
    setSelectedProjectForCCTV,
    cctvIsPlaying,
    setCctvIsPlaying,
    selectedCamera,
    setSelectedCamera,
    openCCTVModal,
    closeCCTVModal,

    // Export
    showExportModal,
    setShowExportModal,
    exportFormat,
    setExportFormat,
    openExportModal,
    closeExportModal,

    // All bids
    showAllBidsModal,
    setShowAllBidsModal,
    openAllBidsModal,
    closeAllBidsModal,

    // Contractor detail
    selectedContractor,
    setSelectedContractor,
    openContractorDetail,
    closeContractorDetail,

    // Reset
    resetAllModals,
  };
}
