# `Clinics`

O principal objetivo deste projeto é o desenvolvimento de uma aplicação empresarial clínica, para a gestão de dados/sinais biomédicos de pessoas com doença cardiovascular.

[<https://github.com/RafaelXokito/Clinics>](https://github.com/RafaelXokito/Clinics)

## `Clinics-client`

Neste repositório mostramos a vertente front-end ou por outras palavras, cliente da aplicação clinics.

<https://github.com/RafaelXokito/Clinics-client>

## `Backstage`

----------------------------------------------------------------------

### `Conta Admin`

#### `Dashboard`

mostra algumas estatisticas

#### `Biometric data type`

explicar tabela, pagination, ordenacao, filtro, download
criar (Peso, 0, 600, kg, Kilo)
edit o criado sem max
edit (Peso, 0, 600, kg, Quilo)
delete "Peso"
restore "Peso"

#### `Patient`

- criar com problemas (email = 2191266@my.ipleiria.pt OU healthcareNº = 123456789)
- criar nice
- edit o criado 
- delete o criado
- restore

#### `Healthcare professionals`

- criar nice
- edit bruna, ver prescricoes, observacoes, patient associados ao healthcare professional
- delete o criado
- restore

#### `Administrators`

- criar
- edit
- delete
- restore

#### qualquer utilizador que seja softdeleted nao se podem autenticar

----------------------------------------------------------------------
### `Conta Healthcare Professional`

#### `Dashboard`

- mostra a ultima prescrição

#### `Patient`

- edit, ver biometric datas, ver observacoes +detalhes
- mostrar que é possivel criar patient

#### `Observation`

- edit, mostrar prescricoes e documentos
- adicionar documento(s) .pdf
- delete
- restore
- criar observacao sem prescricao
- criar observacao com prescricao

#### `Prescricao`

- mostrar que exixte diferença visual de prescrição global e prescricao de uma observação
- editar uma prescricao para com end date menor que data atual e verificar que deixa de ser possivel alterar o mesmo
- delete
- restore
- criar prescricao global

Notas: A prescricao global so entra em vigor após a sua criação e após modificação, e todos os patients que tenham esta prescrição iram deixar de ter e entrará em vigor após a alteração

#### `Issues`

- criar issue para o "Peso"
- edit + mostra lista de issues do biometric data type
- delete
- restore

#### `Biometric data`

- delete
- restore
- create e ver a classificação atribuida, ver que o patient recebeu prescrições globais e ver os emails
- edit e verificar que a classificação é alterada e que o patient recebeu a - prescricao global
- Notas: Quando é criado, alterado, eliminado ou restaurado é recalculada o - ultimo issue do type que se esta a fazer a operação

----------------------------------------------------------------------
### `Conta Patient`

- (219XXXX@my.ipleiria.pt/1234) //Daniel
- (219XXX1@my.ipleiria.pt/1234) //Leonél
- (219XXX2@my.ipleiria.pt/1234) //Andreia
- (219XXX3@my.ipleiria.pt/1234) //Silvia
- (219XXX4@my.ipleiria.pt/1234) //Manuel
- (219XXX5@my.ipleiria.pt/1234) //Isabela

#### `Dashboard`

- Mostrar (LAST BIOMETRIC DATA, ACTIVE PRESCRIPTIONS, YOUR HEALTHCARE PROFESSIONALS)

#### `Biometric Data`

- Mostrar 
  - Coisas gerais (search bar, ordenação, downloads, pagination)
  - Apenas vê os seus; 
  - Pode consultar os seus dados biometricos criados pelos seus healthcare professional;
  - Pode editar/apagar/restore os seus dados biometricos criados por si;

- Criar um dado biometrico
  - Por exemplo: Frequência Respiratória, 45, Sinto-me ansioso

- Editar um dado biometrico (de preferência aquele que foi criado)

- Watch em algum dado biometrico

### `Prescriptions`

- Mostrar
  - Apenas vê as suas prescrições

- Watch

### `Observations`

- Mostrar
  - Apenas vê as suas observações

- Watch
  - Apenas com observação ?e documentos
  - Com observação e prescrição ?e documentos
  
----------------------------------------------------------------------

### Quando são enviados emails

    Create Patient
    Delete Patient
    Restore Patient
    Create Administrator
    Delete Administrator
    Restore Administrator
    Create Healthcare Professional
    Delete Healthcare Professional
    Restore Healthcare Professional
    Patient received a (global) prescription (when biometric data created, when current last deleted, when current last restored, when current last updated)
    Patient associated to Patient (just patient receive)
    Patient received a observation
    Patient received a prescription (particular/by observation)

----------------------------------------------------------------------

### Extras

    Softdeletes
    Import biometric datas
    Export all primary tables (by Table and by Entity/Request)
    Responsive front-end / Aplicação móvel
    Emails
    Documentos na observação (upload/download)
    Estisticas

----------------------------------------------------------------------

## How to set it up?

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
