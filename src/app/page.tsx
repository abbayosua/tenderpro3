'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'sonner';
import { OwnerDashboard, ContractorDashboard, LandingPage } from '@/components/dashboards';
import { 
  BidModal, LoginModal, VerificationModal, RegistrationModal, 
  CreateProjectModal, CompareBidsModal, ProgressModal, CCTVModal, 
  ExportModal, ContractorDetailModal, AllBidsModal 
} from '@/components/modals';

// Hooks
import { useModals } from '@/hooks/useModals';
import { useDataFetching } from '@/hooks/useDataFetching';
import { useOwnerActions } from '@/hooks/useOwnerActions';
import { useContractorActions } from '@/hooks/useContractorActions';

import { DEFAULT_REGISTRATION_FORM } from '@/types';
import { formatRupiah, calculateMatchScore } from '@/lib/utils';
import type { RegistrationFormData } from '@/types';

export default function TenderProApp() {
  const { user, login, logout, isLoading } = useAuthStore();
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('landing');
  
  // Registration form state
  const [registerForm, setRegisterForm] = useState<RegistrationFormData>(DEFAULT_REGISTRATION_FORM);
  
  // Modal state (from hook)
  const modals = useModals();
  
  // Data fetching (from hook)
  const {
    contractors,
    projects,
    ownerStats,
    contractorStats,
    notifications,
    unreadCount,
    favorites,
    documents,
    dataLoading,
    refreshDashboardStats,
    refreshDocuments,
    refreshFavorites,
  } = useDataFetching(user);
  
  // Owner actions (from hook)
  const ownerActions = useOwnerActions(
    user,
    refreshDashboardStats,
    refreshDocuments,
    refreshFavorites,
    modals.setMilestones,
    modals.setProgressPercent,
  );
  
  // Contractor actions (from hook)
  const contractorActions = useContractorActions(
    user,
    refreshDashboardStats,
    refreshDocuments,
  );

  // CCTV auto-show ref
  const cctvShownRef = useRef(false);

  // Auto-show CCTV modal for IN_PROGRESS project
  useEffect(() => {
    if (!user?.id || user.role !== 'OWNER' || !ownerStats?.projects) return;
    
    const inProgressProject = ownerStats.projects.find(p => p.status === 'IN_PROGRESS');
    
    if (inProgressProject && !cctvShownRef.current) {
      cctvShownRef.current = true;
      modals.setSelectedProjectForCCTV({ 
        id: inProgressProject.id, 
        title: inProgressProject.title, 
        status: inProgressProject.status 
      });
      modals.setShowCCTVModal(true);
    }
  }, [user?.id, user?.role, ownerStats?.projects, modals]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(
      modals.loginEmail,
      modals.loginPassword,
      modals.loginRole
    );
    if (success) {
      toast.success('Login berhasil!');
      modals.setLoginOpen(false);
      setActiveTab('dashboard');
    } else {
      toast.error('Login gagal. Periksa email dan password Anda.');
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak sama');
      return;
    }
    
    if (registerForm.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    
    modals.setRegisterLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          name: registerForm.name,
          phone: registerForm.phone || null,
          role: modals.registerRole,
          companyName: registerForm.companyName || null,
          companyType: registerForm.companyType || null,
          npwp: registerForm.npwp || null,
          nib: registerForm.nib || null,
          address: registerForm.address || null,
          city: registerForm.city || null,
          province: registerForm.province || null,
          postalCode: registerForm.postalCode || null,
          specialization: registerForm.specialization || null,
          experienceYears: registerForm.experienceYears || null,
          employeeCount: registerForm.employeeCount || null,
          description: registerForm.description || null,
          ownerCompanyName: registerForm.ownerCompanyName || null,
          ownerCompanyType: registerForm.ownerCompanyType || null,
          ownerNpwp: registerForm.ownerNpwp || null,
          ownerAddress: registerForm.ownerAddress || null,
          ownerCity: registerForm.ownerCity || null,
          ownerProvince: registerForm.ownerProvince || null,
          ownerPostalCode: registerForm.ownerPostalCode || null,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success('Registrasi berhasil! Silakan login dengan akun Anda.');
        modals.setRegisterOpen(false);
        modals.setRegisterStep(1);
        setRegisterForm(DEFAULT_REGISTRATION_FORM);
        modals.setLoginOpen(true);
      } else {
        toast.error(data.message || 'Gagal melakukan registrasi');
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      modals.setRegisterLoading(false);
    }
  };

  // Logout handler
  const handleLogout = useCallback(() => {
    logout();
    setActiveTab('landing');
    modals.resetAllModals();
    cctvShownRef.current = false;
    toast.success('Logout berhasil');
  }, [logout, modals]);

  // Bid submit handler
  const handleBid = async () => {
    if (!modals.selectedProject || !user) return;
    
    const success = await contractorActions.handleSubmitBid(
      modals.selectedProject.id,
      modals.bidProposal,
      modals.bidPrice,
      modals.bidDuration
    );
    
    if (success) {
      modals.setShowBidModal(false);
      modals.setBidProposal('');
      modals.setBidPrice('');
      modals.setBidDuration('');
    }
  };

  // Document upload handler
  const handleUploadDocument = async () => {
    const success = await ownerActions.handleUploadDocument(
      modals.docType,
      modals.docName
    );
    if (success) {
      modals.setShowVerificationModal(false);
      modals.setDocName('');
    }
  };

  // Render modals
  const renderModals = () => (
    <>
      <BidModal
        open={modals.showBidModal}
        onOpenChange={modals.setShowBidModal}
        selectedProject={modals.selectedProject}
        bidProposal={modals.bidProposal}
        setBidProposal={modals.setBidProposal}
        bidPrice={modals.bidPrice}
        setBidPrice={modals.setBidPrice}
        bidDuration={modals.bidDuration}
        setBidDuration={modals.setBidDuration}
        onSubmit={handleBid}
      />

      <LoginModal
        open={modals.loginOpen}
        onOpenChange={modals.setLoginOpen}
        loginRole={modals.loginRole}
        setLoginRole={modals.setLoginRole}
        email={modals.loginEmail}
        setEmail={modals.setLoginEmail}
        password={modals.loginPassword}
        setPassword={modals.setLoginPassword}
        isLoading={isLoading}
        onLogin={handleLogin}
        onSwitchToRegister={() => { modals.setLoginOpen(false); modals.setRegisterOpen(true); }}
      />

      <VerificationModal
        open={modals.showVerificationModal}
        onOpenChange={modals.setShowVerificationModal}
        docType={modals.docType}
        setDocType={modals.setDocType}
        docName={modals.docName}
        setDocName={modals.setDocName}
        documents={documents}
        onUpload={handleUploadDocument}
        onRequestVerification={ownerActions.handleRequestVerification}
      />

      <RegistrationModal
        open={modals.registerOpen}
        onOpenChange={modals.setRegisterOpen}
        registerRole={modals.registerRole}
        setRegisterRole={modals.setRegisterRole}
        registerStep={modals.registerStep}
        setRegisterStep={modals.setRegisterStep}
        registerLoading={modals.registerLoading}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        onRegister={handleRegister}
        onLoginClick={() => { modals.setRegisterOpen(false); modals.setLoginOpen(true); }}
      />

      <ContractorDetailModal
        open={!!modals.selectedContractor}
        onOpenChange={() => modals.setSelectedContractor(null)}
        selectedContractor={modals.selectedContractor}
      />

      <CreateProjectModal
        open={modals.showCreateProjectModal}
        onOpenChange={modals.setShowCreateProjectModal}
        newProject={modals.newProject}
        setNewProject={modals.setNewProject}
        onCreate={async () => {
          const success = await ownerActions.handleCreateProject(modals.newProject);
          if (success) {
            modals.setShowCreateProjectModal(false);
            modals.setNewProject({
              title: '',
              description: '',
              category: 'Pembangunan Baru',
              location: '',
              budget: '',
              duration: '',
              requirements: '',
            });
          }
        }}
        formatRupiah={formatRupiah}
      />

      <CompareBidsModal
        open={modals.showCompareModal}
        onOpenChange={modals.setShowCompareModal}
        selectedBidsForCompare={modals.selectedBidsForCompare}
        allBids={ownerStats?.projects.flatMap(p => p.bids) || []}
        onAcceptBid={ownerActions.handleAcceptBid}
        onRejectBid={ownerActions.handleRejectBid}
        formatRupiah={formatRupiah}
        calculateMatchScore={calculateMatchScore}
      />

      <ProgressModal
        open={modals.showProgressModal}
        onOpenChange={modals.setShowProgressModal}
        selectedProjectForProgress={modals.selectedProjectForProgress}
        milestones={modals.milestones}
        progressPercent={modals.progressPercent}
        formatRupiah={formatRupiah}
        onUpdateMilestone={(milestoneId, status) => {
          if (modals.selectedProjectForProgress) {
            ownerActions.handleUpdateMilestone(milestoneId, status, modals.selectedProjectForProgress.id);
          }
        }}
      />

      <CCTVModal
        open={modals.showCCTVModal}
        onOpenChange={modals.setShowCCTVModal}
        selectedProjectForCCTV={modals.selectedProjectForCCTV}
        selectedCamera={modals.selectedCamera}
        setSelectedCamera={modals.setSelectedCamera}
        cctvIsPlaying={modals.cctvIsPlaying}
        setCctvIsPlaying={modals.setCctvIsPlaying}
        onProgressClick={() => {
          if (modals.selectedProjectForCCTV) {
            modals.setSelectedProjectForProgress({
              id: modals.selectedProjectForCCTV.id,
              title: modals.selectedProjectForCCTV.title,
              category: 'Konstruksi',
              budget: 0
            });
            ownerActions.loadMilestones(modals.selectedProjectForCCTV.id);
            modals.setShowProgressModal(true);
          }
        }}
        onScreenshot={() => toast.success('Screenshot disimpan!')}
        onRecord={() => toast.success('Rekaman dimulai!')}
        onZoom={() => toast.info('Fitur zoom dalam pengembangan')}
      />

      <ExportModal
        open={modals.showExportModal}
        onOpenChange={modals.setShowExportModal}
        exportFormat={modals.exportFormat}
        setExportFormat={modals.setExportFormat}
        onExport={() => ownerActions.handleExportReport(
          ownerStats?.projects[0]?.id || '',
          modals.exportFormat,
          ownerStats
        )}
      />

      <AllBidsModal
        open={modals.showAllBidsModal}
        onOpenChange={modals.setShowAllBidsModal}
        projects={ownerStats?.projects || []}
        selectedBidsForCompare={modals.selectedBidsForCompare}
        onToggleBidCompare={modals.toggleBidSelection}
        onAcceptBid={ownerActions.handleAcceptBid}
        onRejectBid={ownerActions.handleRejectBid}
        onCompareClick={() => { modals.setShowCompareModal(true); modals.setShowAllBidsModal(false); }}
        formatRupiah={formatRupiah}
      />
    </>
  );

  // Show loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Render Owner Dashboard
  if (activeTab === 'dashboard' && user?.role === 'OWNER' && ownerStats) {
    return (
      <OwnerDashboard
        user={user}
        ownerStats={ownerStats}
        notifications={notifications}
        unreadCount={unreadCount}
        favorites={favorites}
        milestones={modals.milestones}
        onMarkNotificationRead={ownerActions.handleMarkNotificationRead}
        onMarkAllRead={ownerActions.handleMarkAllRead}
        onLogout={handleLogout}
        onShowVerificationModal={() => modals.setShowVerificationModal(true)}
        onShowCreateProjectModal={() => modals.setShowCreateProjectModal(true)}
        onShowExportModal={() => modals.setShowExportModal(true)}
        onShowCCTVModal={(project) => {
          modals.setSelectedProjectForCCTV(project);
          modals.setShowCCTVModal(true);
        }}
        onShowProgressModal={(project) => {
          modals.setSelectedProjectForProgress(project);
          modals.setShowProgressModal(true);
        }}
        onLoadMilestones={ownerActions.loadMilestones}
        onAcceptBid={ownerActions.handleAcceptBid}
        onRejectBid={ownerActions.handleRejectBid}
        onAddFavorite={ownerActions.handleAddFavorite}
        onRemoveFavorite={ownerActions.handleRemoveFavorite}
        toggleBidSelection={modals.toggleBidSelection}
        selectedBidsForCompare={modals.selectedBidsForCompare}
        onShowCompareModal={() => modals.setShowCompareModal(true)}
        renderModals={renderModals}
      />
    );
  }

  // Render Contractor Dashboard
  if (activeTab === 'dashboard' && user?.role === 'CONTRACTOR' && contractorStats) {
    return (
      <ContractorDashboard
        user={user}
        contractorStats={contractorStats}
        onLogout={handleLogout}
        onShowVerificationModal={() => modals.setShowVerificationModal(true)}
        onShowBidModal={(project) => {
          modals.setSelectedProject(project);
          modals.setShowBidModal(true);
        }}
        renderModals={renderModals}
      />
    );
  }

  // Render Landing Page (default)
  return (
    <>
      {renderModals()}
      <LandingPage
        user={user}
        contractors={contractors}
        projects={projects}
        onLogin={() => modals.setLoginOpen(true)}
        onRegister={(role) => {
          modals.setRegisterRole(role);
          modals.setRegisterOpen(true);
        }}
        onLogout={handleLogout}
        onDashboard={() => setActiveTab('dashboard')}
        onSelectContractor={modals.setSelectedContractor}
      />
    </>
  );
}
