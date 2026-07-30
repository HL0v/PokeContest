React UI Screens Prompt - Contest Nexus
This document provides detailed visual and structural specifications for a coding agent to build a multi-screen React application based on the provided designs.

Screen 1: Terminal Access Login (image_0.png)
Visual Style: Minimalist, clean, centralized login card.

Layout:

A light gray or blue background for the full screen.

A single, centralized, white card with a distinctive red top border.

Card Content (Top to Bottom):

Header:

A central red circular logo with a target-like design.

The text "Contest Nexus" in bold, red font directly below the logo.

Screen Title:

Large, bold text: "Acessar Terminal" (Portuguese).

Instruction:

Standard text: "Selecione seu cargo para iniciar a jornada." (Portuguese).

Role Selector (Segmented Control):

A group of three distinct, adjacent button components.

BOSS: Icon (a star), text "BOSS". Highlighted state with a solid red background and white text/icon.

ANALISTA: Icon (a bar graph), text "ANALISTA". Non-active state with a gray outline and text/icon.

ARTISTA: Icon (a artist palette), text "ARTISTA". Non-active state with a gray outline and text/icon.

Input Fields:

IDENTIFICAÇÃO: Label text. An input field with a light gray background, a user icon (person silhouette) on the left, and placeholder text "Nome de usuário ou ID".

CHAVE DE ACESSO: Label text and a right-aligned text link "Esqueceu?" (Portuguese). An input field with a light gray background, a lock icon on the left, and a masked password value (e.g., "********").

Options:

A standard checkbox with the label "Lembrar neste dispositivo" (Portuguese).

Main Button:

A large, solid red button centered on the card.

Text: "AUTENTICAR NO SISTEMA" (Portuguese), followed by a right-facing arrow icon (->).

Card Footer (Links):

Standard text: "Não possui credenciais?" (Portuguese).

A text link: "SOLICITAR REGISTRO" (Portuguese).

Card Status Bar:

A full-width, light gray footer strip at the bottom of the card.

Left side: A shield icon and the text "Encriptação Ativa" (Portuguese).

Right side: Text "v2.4.0-nexus" for the version.

Screen Footer (Global):

Center-aligned at the bottom of the screen.

A globe icon and the text "Português (BR)".

A headset icon and the text "Suporte Central" (Portuguese).

Screen 2: Boss Requests Dashboard (image_1.png)
Visual Style: Modern, clean, professional web application dashboard layout.

Layout:

Top Navbar: Fixed, horizontally spanning the screen.

Left Sidebar: Vertically spanning the screen, positioned on the left.

Main Content Area: The remaining screen space for the dashboard's core information.

Components:

1. Top Navbar:
Left side: "Contest Nexus" text logo in red.

Main navigation links (underlined active state): "Dashboard" (inactive), "Requests" (active, red underline).

Right side:

A notification bell icon with an active indicator dot.

A gear icon (settings).

A user profile picture inside a circular container.

2. Left Sidebar:
Top logo and subtitle: Red HQ icon, text "Contest HQ" (large) and "Advanced Exploration" (small).

Main menu links with icons (active blue background):

Dashboard (graph icon).

Requests (active state with icon, text "Requests", and blue background).

Submissions (pencil icon).

Management (user-cog icon).

Bottom actions:

"Novo Pedido" button: Solid red button with a white plus icon and text.

Role Switcher: A component that shows the current role, has a refresh-style icon, and acts like a role switching menu.

Logout link with a power-style icon.

3. Main Content Area:
Title Section:
Large, bold title: "Painel do Chefe" (Portuguese).

Description text: "Gerencie suas expedições e solicitações de Pokémon. Acompanhe o progresso das suas equipes em tempo real." (Portuguese).

Stat Card (Top Right):
A distinct card with a red background.

Label: "ATIVIDADE TOTAL" (Portuguese).

Big number: "12" (bold, white).

Sub-text: "4 Pedidos Pendentes" (Portuguese).

A large rocket ship icon in the background.

Requests Table ("Meus Pedidos Ativos"):
Section header: Text "Meus Pedidos Ativos" (Portuguese) with a list-style icon.

Table controls: Search and filter/sort icons.

Table Columns: POKÉMON / TIPO, HABITAT, DESCRIÇÃO DETALHADA, STATUS, PROGRESSO, AÇÕES.

Table Rows:

Row 1 (Lapras): Pokémon icon (blue drop), text "Lapras" and "Água / Gelo". Habitat: "Ilhas Seafoam". Description text. Status: Blue badge "Em Busca". Progress: Blue progress bar (partial). Ações: Three dots menu.

Row 2 (Arcanine): Pokémon icon (orange fire), text "Arcanine" and "Fogo". Habitat: "Cinnabar Island". Description text. Status: Orange badge "Aguardando". Progress: Yellow progress bar (partial). Ações: Three dots menu.

Row 3 (Alakazam): Pokémon icon (purple head with brain), text "Alakazam" and "Psíquico". Habitat: "Caverna de Cerulean". Description text. Status: Green badge "Concluído". Progress: Green progress bar (full). Ações: Three dots menu.

Screen 3: Analista Curadoria Dashboard (image_2.png)
Visual Style: Clean, information-dense web application dashboard.

Layout: Similar dashboard structure to Screen 2.

Top Navbar

Left Sidebar

Main Content Area

Components:

1. Top Navbar:
Left side: "Contest Nexus" text logo. Next to it, a "ANALISTA" badge in purple.

Center: A search bar with a search icon and placeholder text "Procurar requisições ou artistas..." (Portuguese).

Right side: Bell (active dot), Gear settings, and a user profile picture in a circle.

2. Left Sidebar:
Top: Logo and text "Contest HQ", "Advanced Exploration".

Main menu links: Dashboard (active), Requests, Submissions, Management.

Bottom:

A Role Switcher showing "Analista" with a specific role icon.

Logout link ("Sair") with a power icon.

3. Main Content Area:
Title Section:
Large bold title: "Painel de Curadoria" (Portuguese).

Description text: "Gerencie as requisições de novos concursos e valide as submissões dos artistas ativos na plataforma Nexus." (Portuguese).

Top right action buttons:

"+ Filtrar" button (Portuguese).

"+ Novo Concurso" button (red with white plus icon, Portuguese).

Stat Cards (Top Row):
CONCURSOS ATIVOS: Number "12", green "+2" indicator.

PENDENTES DO BOSS: Number "05", red "URGENTE" badge.

OBRAS PARA VALIDAR: Number "28", "84% Meta" progress.

TEMPO MÉDIO VALIDAÇÃO: Text "1.2h", below it a progress bar.

Two Main List Columns:
Left Column: "Requisições do Boss" (Boss Requests)

Title: Text "Requisições do Boss" with a red megaphone icon and count "5 itens".

A vertical list of stacked card-like items.

Card 1: Campanha Lançamento "Ethereal". Red "CRÍTICO" badge. Description: "Necessita 3 variações de arte para..." Button: Solid red "PUBLICAR AGORA". Sub-text: "Enviado por: Boss_Nexus • 2h atrás".

Card 2: Redesign de Ativos Tier 3. Gray "ROTINA" badge. Description: "Atualização visual para os crachás..." Button: White with border "REVISAR". Sub-text: "Enviado por: Boss_Nexus • Ontem".

Bottom link: Text "Ver histórico de requisições".

Right Column: "Submissões de Artistas" (Artist Submissions)

Title: Text "Submissões de Artistas" with a pencil icon and filters "TODOS", "EM ESPERA (28)".

A vertical list of table-style entries.

Table Headers: ARTISTA, CONCURSO, PREVIEW, AVALIAÇÃO.

Table Rows:

Row 1: Artist (Yellow circle AR Arthur_V, Pro Artist), Cyberpunk Neon City, Thumbnail image, input with "Nota" (Note).

Row 2: Artist (Purple circle EL Elena_Sky, Rising Star), Minimal Nature Icons, Thumbnail image, input with "Nota" (Note).

Row 3: Artist (Red circle MX Max_Z, Vanguard), 3D Abstract Tech, Thumbnail image, input with "Nota" (Note).

Bottom link: Text "Ver todas as 28 submissões" with a right arrow.

Critical Contests Status Section:
Section header: Text "Status de Concursos Críticos" (Portuguese).

A horizontal row of three statistic cards.

Game Asset Pack v2: "ARTIST TRACK" label, Progress Total 65% with a bar, sub-text: "18 de 30 submissões aprovadas pelo Analista."

Rebranding Nexus: "BOSS PRIORITY" label, Progress Total 20% with a bar, sub-text: "Aguardando definição de cores primárias do Boss."

Community Icons: "ACTIVE REVIEW" label, Progress Total 92% with a bar, sub-text: "Fase final de revisão técnica pelo Analista."

Floating Button:
Bottom right: A red circular floating action button with a chat bubble icon inside.
