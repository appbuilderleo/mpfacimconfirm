import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeToggle } from '../components/ThemeToggle';

const PoliticaPrivacidade = () => {
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-background flex flex-col">
      <Box className="w-full flex justify-end p-4">
        <ThemeToggle />
      </Box>
      <Container maxWidth="md" className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          className="mb-6"
          color="primary"
        >
          Voltar
        </Button>
        <Paper elevation={0} className="p-8 sm:p-12 rounded-2xl bg-card shadow-sm border border-border">
          <Typography variant="h4" component="h1" className="font-extrabold text-foreground mb-6">
            Política de Privacidade e Termos de Uso
          </Typography>
          
          <Typography variant="body2" className="text-muted-foreground mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-MZ')}
          </Typography>

          <Box className="space-y-6 text-foreground">
            <section>
              <Typography variant="h6" className="font-bold text-foreground mb-2">
                1. Informações que Recolhemos
              </Typography>
              <Typography variant="body1">
                Ao utilizar o nosso formulário de confirmação de presença (RSVP), recolhemos as seguintes informações pessoais de forma voluntária: Nome Completo, Endereço de Email e Número de Celular/WhatsApp. 
                Estes dados são essenciais para garantir a sua inscrição, o envio de bilhetes e comunicações estritamente relacionadas com a 61ª edição da FACIM 2026.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-bold text-foreground mb-2">
                2. Uso e Finalidade dos Dados
              </Typography>
              <Typography variant="body1">
                A recolha destes dados tem como base legal o seu consentimento explícito e destina-se única e exclusivamente a:
              </Typography>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Gestão da lotação e controlo de acessos no evento.</li>
                <li>Envio de confirmações, credenciais e alertas (via Email ou WhatsApp).</li>
                <li>Estatísticas anonimizadas de participação.</li>
              </ul>
              <Typography variant="body1" className="mt-2">
                Garantimos que os seus dados <strong>não serão comercializados</strong> a terceiros, nem integrados em bases de dados de marketing não relacionadas sem o seu consentimento adicional.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-bold text-foreground mb-2">
                3. Partilha de Dados
              </Typography>
              <Typography variant="body1">
                Os dados poderão ser partilhados apenas com os fornecedores tecnológicos estritamente necessários para o funcionamento da plataforma (ex: serviços de alojamento em cloud e envio de emails), os quais estão obrigados a manter o sigilo e segurança da informação, e apenas na medida do exigido por lei.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-bold text-foreground mb-2">
                4. Retenção de Dados
              </Typography>
              <Typography variant="body1">
                As suas informações pessoais serão conservadas apenas pelo período necessário para cumprir as finalidades descritas nesta política, ou durante o período legalmente exigido por legislação local aplicável. Após o término do evento e o fim das obrigações legais, os dados serão eliminados ou devidamente anonimizados.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-bold text-foreground mb-2">
                5. Os Seus Direitos
              </Typography>
              <Typography variant="body1">
                De acordo com a Lei de Proteção de Dados aplicável (como a Lei n.º 3/2017 de Moçambique, e de forma complementar, alinhada com as melhores práticas da LGPD/RGPD), possui o direito de:
              </Typography>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Solicitar o acesso, retificação ou eliminação dos seus dados a qualquer momento.</li>
                <li>Revogar o seu consentimento (o que invalidará a sua confirmação no evento).</li>
                <li>Opor-se ao tratamento dos seus dados.</li>
              </ul>
              <Typography variant="body1" className="mt-2">
                Para exercer qualquer um destes direitos, deverá entrar em contacto direto com a organização do evento.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" className="font-bold text-foreground mb-2">
                6. Limitação de Responsabilidade
              </Typography>
              <Typography variant="body1">
                Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger os seus dados pessoais contra acesso, alteração ou destruição não autorizados. No entanto, nenhum sistema online é infalível. Na máxima extensão permitida por lei, a organização da FACIM 2026 isenta-se de responsabilidade por quebras de segurança decorrentes de ataques cibernéticos sofisticados e imprevisíveis (força maior).
              </Typography>
            </section>

          </Box>
          
          <Box className="mt-8 p-4 bg-muted rounded-lg text-xs text-muted-foreground border border-border">
            <strong>Aviso Legal:</strong> Este documento tem caráter informativo. A organização do evento reserva-se ao direito de atualizar esta política a qualquer momento, pelo que recomendamos a sua leitura periódica. Ao confirmar a sua inscrição, o utilizador declara ter lido, compreendido e aceite integralmente estes termos.
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PoliticaPrivacidade;
