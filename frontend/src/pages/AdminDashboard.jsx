import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Chip,
  CircularProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import { ThemeToggle } from '../components/ThemeToggle';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData(1);
  }, [token, navigate]);

  const fetchData = async (page) => {
    setIsLoading(true);
    try {
      const apiUrl = `http://localhost:5000/api/admin/inscritos?page=${page}&limit=20`;
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    fetchData(value);
  };

  const handleExport = async () => {
    try {
      const apiUrl = 'http://localhost:5000/api/admin/exportar';
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file download
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inscritos-facim-2026-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (isLoading && data.length === 0) {
    return (
      <Box className="min-h-screen bg-background flex flex-col">
        <Box className="w-full flex justify-end p-4">
          <ThemeToggle />
        </Box>
        <Box className="flex-1 flex items-center justify-center">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-background flex flex-col">
      <Box className="w-full bg-card border-b border-border p-4 px-6 flex justify-between items-center shadow-sm">
        <Typography variant="h6" className="font-bold text-foreground">
          FACIM 2026 Admin
        </Typography>
        <Box className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="text" 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            Sair
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" className="py-8 flex-1">
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" className="font-bold text-foreground">
              Inscritos
            </Typography>
            <Typography component="div" variant="body1" className="text-muted-foreground mt-1">
              Total de confirmações: <Chip label={meta.total} color="secondary" size="small" className="font-bold" />
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            className="shadow-none"
          >
            Exportar Excel
          </Button>
        </Box>

        <Paper elevation={0} className="w-full overflow-hidden border border-border shadow-sm rounded-xl bg-card">
          <TableContainer className="max-h-[600px]">
            <Table stickyHeader aria-label="tabela de inscritos">
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold bg-muted text-foreground">Nome Completo</TableCell>
                  <TableCell className="font-bold bg-muted text-foreground">Email</TableCell>
                  <TableCell className="font-bold bg-muted text-foreground">Celular</TableCell>
                  <TableCell className="font-bold bg-muted text-foreground">Data de Confirmação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow hover key={row.id} className="last:border-0">
                    <TableCell className="text-foreground">{row.nome}</TableCell>
                    <TableCell className="text-foreground">{row.email}</TableCell>
                    <TableCell className="text-foreground">{row.celular}</TableCell>
                    <TableCell className="text-foreground">
                      {new Date(row.data_confirmacao).toLocaleString('pt-MZ')}
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className="py-8 text-muted-foreground">
                      Nenhuma confirmação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box className="p-4 border-t border-border flex justify-center bg-card">
            <Pagination 
              count={meta.totalPages} 
              page={meta.page} 
              onChange={handlePageChange} 
              color="primary" 
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
