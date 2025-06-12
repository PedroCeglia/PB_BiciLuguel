
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/bike';
import { authService } from '@/services/auth';
import { ApiUserResponse } from '@/types/auth';
import { authEvents } from '@/services/authEvents';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Função para mapear dados da API para o formato interno
const mapApiUserToUser = (apiUser: ApiUserResponse): User => {
  return {
    id: apiUser.id.toString(),
    name: apiUser.nome,
    email: apiUser.email,
    avatar: apiUser.avatar || '',
    totalRides: apiUser.totalViagens,
    totalSpent: apiUser.totalGasto,
    memberSince: apiUser.membroDesde,
    favoriteLocations: apiUser.locaisFavoritos,
    telefone: '', // Estes campos virão da API de usuário completa
    documento: '',
    metodo_Pagamento: '',
    status: ''
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🔍 AuthProvider renderizado - user:', user, 'isLoading:', isLoading);

  // Função para logout forçado (chamada quando token expira)
  const forceLogout = () => {
    console.log('🔒 Executando logout automático por expiração de token');
    authService.logout();
    setUser(null);
    
    // Mostrar notificação ao usuário (opcional)
    if (typeof window !== 'undefined') {
      // Aqui você pode adicionar um toast ou alert se necessário
      console.log('Sessão expirada. Redirecionando para login...');
    }
  };

  // Função para recarregar dados do usuário
  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const { userService } = await import('@/services/user');
      const userData = await userService.getById(parseInt(user.id));
      
      // Mapear dados da API completa e atualizar localStorage
      const updatedUser: User = {
        ...user,
        name: userData.nome || user.name,
        email: userData.email || user.email,
        telefone: userData.telefone || '',
        documento: userData.documento || '',
        metodo_Pagamento: userData.metodo_Pagamento || '',
        status: userData.status || ''
      };
      
      setUser(updatedUser);
      
      // Atualizar dados no localStorage também
      const currentUserData = authService.getUserData();
      if (currentUserData) {
        const updatedApiUser: ApiUserResponse = {
          ...currentUserData,
          nome: userData.nome || currentUserData.nome,
          email: userData.email || currentUserData.email
        };
        authService.updateUserData(updatedApiUser);
      }
    } catch (error) {
      console.error('Erro ao recarregar dados do usuário:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 AuthProvider useEffect executado');
    
    // Configurar listener para eventos de token expirado
    const handleTokenExpired = () => {
      console.log('🔒 Token expirado recebido no AuthContext');
      forceLogout();
    };

    authEvents.on('token-expired', handleTokenExpired);

    const initializeAuth = async () => {
      console.log('🔍 Inicializando autenticação...');
      
      try {
        const isTokenValid = await authService.validateToken();
        console.log('🔍 Token válido:', isTokenValid);
        
        if (isTokenValid) {
          // Recuperar dados do usuário do localStorage
          const savedUserData = authService.getUserData();
          console.log('🔍 Dados salvos do usuário:', savedUserData);
          
          if (savedUserData) {
            const mappedUser = mapApiUserToUser(savedUserData);
            
            // Buscar dados completos da API
            try {
              const { userService } = await import('@/services/user');
              const completeUserData = await userService.getById(savedUserData.id);
              
              // Mesclar dados completos
              const completeUser: User = {
                ...mappedUser,
                telefone: completeUserData.telefone || '',
                documento: completeUserData.documento || '',
                metodo_Pagamento: completeUserData.metodo_Pagamento || '',
                status: completeUserData.status || ''
              };
              
              console.log('✅ Usuário logado automaticamente:', completeUser);
              setUser(completeUser);
            } catch (error) {
              console.error('Erro ao buscar dados completos:', error);
              // Se falhar, usar dados básicos do localStorage
              console.log('⚠️ Usando dados básicos do localStorage');
              setUser(mappedUser);
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro na inicialização da autenticação:', error);
      } finally {
        console.log('🏁 Inicialização concluída, removendo loading');
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup: remover listener quando componente desmontar
    return () => {
      console.log('🧹 Limpando listeners do AuthProvider');
      authEvents.off('token-expired', handleTokenExpired);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Tentando fazer login...');
    setIsLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      console.log('✅ Login bem-sucedido:', response);
      
      // Mapear dados da API para o formato interno
      const mappedUser = mapApiUserToUser(response.usuario);
      
      // Buscar dados completos da API
      try {
        const { userService } = await import('@/services/user');
        const completeUserData = await userService.getById(response.usuario.id);
        
        // Mesclar dados completos
        const completeUser: User = {
          ...mappedUser,
          telefone: completeUserData.telefone || '',
          documento: completeUserData.documento || '',
          metodo_Pagamento: completeUserData.metodo_Pagamento || '',
          status: completeUserData.status || ''
        };
        
        setUser(completeUser);
        console.log('✅ Usuário definido com dados completos:', completeUser);
      } catch (error) {
        console.error('Erro ao buscar dados completos:', error);
        // Se falhar, usar dados básicos
        setUser(mappedUser);
        console.log('⚠️ Usuário definido com dados básicos:', mappedUser);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    authService.logout();
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    refreshUser,
    isLoading
  };

  console.log('🔍 AuthProvider renderizando com contexto:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
