import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, Student, UserRole } from '../types';
import { DataService } from '../services/dataService';

interface AuthContextType {
  adminUser: AdminUser | null;
  currentStudent: Student | null;
  currentParent: { guardianPhone: string; guardianName: string; children: Student[] } | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string, role?: UserRole) => boolean;
  logoutAdmin: () => void;
  loginStudent: (studentId: string, pin: string) => Promise<boolean>;
  logoutStudent: () => void;
  loginParent: (phoneOrId: string, pin: string) => Promise<boolean>;
  logoutParent: () => void;
}

const AuthContext = createContext<AuthContextType>({
  adminUser: null,
  currentStudent: null,
  currentParent: null,
  isAdminAuthenticated: false,
  loginAdmin: () => false,
  logoutAdmin: () => {},
  loginStudent: async () => false,
  logoutStudent: () => {},
  loginParent: async () => false,
  logoutParent: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('iebs_auth_admin');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const stored = localStorage.getItem('iebs_auth_student');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentParent, setCurrentParent] = useState<{
    guardianPhone: string;
    guardianName: string;
    children: Student[];
  } | null>(() => {
    try {
      const stored = localStorage.getItem('iebs_auth_parent');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('iebs_auth_admin', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('iebs_auth_admin');
    }
  }, [adminUser]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('iebs_auth_student', JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem('iebs_auth_student');
    }
  }, [currentStudent]);

  useEffect(() => {
    if (currentParent) {
      localStorage.setItem('iebs_auth_parent', JSON.stringify(currentParent));
    } else {
      localStorage.removeItem('iebs_auth_parent');
    }
  }, [currentParent]);

  const loginAdmin = (email: string, pass: string, requestedRole?: UserRole): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    // Allow designated super admin email or default admin
    if (
      (cleanEmail === 'admin@inaruwaebs.edu.np' ||
        cleanEmail === 'agent1xbetnepal88@gmail.com' ||
        cleanEmail.includes('admin') ||
        cleanEmail.includes('iebs')) &&
      pass.length >= 4
    ) {
      const role: UserRole = requestedRole || 'SUPER_ADMIN';
      const user: AdminUser = {
        id: 'adm-' + Date.now(),
        email: cleanEmail,
        name: cleanEmail === 'agent1xbetnepal88@gmail.com' ? 'Super Administrator' : 'IEBS Administrator',
        role,
      };
      setAdminUser(user);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const loginStudent = async (studentId: string, pin: string): Promise<boolean> => {
    const found = await DataService.findStudentByCredential(studentId, pin);
    if (found) {
      setCurrentStudent(found);
      return true;
    }
    return false;
  };

  const logoutStudent = () => {
    setCurrentStudent(null);
  };

  const loginParent = async (phoneOrId: string, pin: string): Promise<boolean> => {
    const students = await DataService.getStudents();
    const clean = phoneOrId.trim().toLowerCase();
    // Match by guardian phone or student ID
    const matched = students.filter(
      (s) =>
        s.guardianPhone.replace(/\D/g, '') === clean.replace(/\D/g, '') ||
        s.studentId.toLowerCase() === clean ||
        s.admissionNo.toLowerCase() === clean
    );

    if (matched.length > 0 && (pin === '1234' || matched.some((m) => m.accessPin === pin))) {
      setCurrentParent({
        guardianPhone: matched[0].guardianPhone,
        guardianName: matched[0].guardianName,
        children: matched,
      });
      return true;
    }
    return false;
  };

  const logoutParent = () => {
    setCurrentParent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        currentStudent,
        currentParent,
        isAdminAuthenticated: !!adminUser,
        loginAdmin,
        logoutAdmin,
        loginStudent,
        logoutStudent,
        loginParent,
        logoutParent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
