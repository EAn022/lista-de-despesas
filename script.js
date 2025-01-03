function init(){
    listarAno()
    listarMes()
    listarTipo()
}

function listarAno(){
    let ano = document.getElementById('ano')  
    
    for(let i = 1991; i <= 2024; i++){
        let novoAno = document.createElement('option')
        novoAno.textContent = i
        novoAno.value = i
        ano.appendChild(novoAno)
    }
}

function listarMes(){
    let listaMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    let mes = document.getElementById('mes')
    let mesN = 1
    listaMeses.forEach((m)=>{
        let novoMes = document.createElement('option')
        novoMes.textContent = m
        novoMes.value = mesN++
        mes.appendChild(novoMes)
    })
}

function listarTipo(){
    let listaTipo = ['Aluguel', 'Alimentação', 'Transporte', 'Educação', 'Saúde', 'Lazer', 'Internet', 'Energia elétrica', 'Água', 'Telefonia', 'Seguros', 'Impostos', 'Manutenção', 'Roupas', 'Assinaturas']
    let tipo = document.getElementById('tipo')

    listaTipo.forEach((t)=>{
        let novoTipo = document.createElement('option')
        novoTipo.textContent = t
        novoTipo.value = removerAcentos(t).toLowerCase()
        tipo.appendChild(novoTipo)
    })
}

function removerAcentos(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function cadastrarDespesa(){
    let dia = document.getElementById('dia')
    let mes = document.getElementById('mes')
    let ano = document.getElementById('ano')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let custo = document.getElementById('custo')

    let despesa = new Despesa(dia.value, mes.value, ano.value, tipo.value, descricao.value, custo.value)
    if(despesa.validarDados()){
        let db = new BD(despesa)
        db.criarRegistro(despesa)
        exibirModal(true)

        dia.value = ''
        mes.value = ''
        ano.value = ''
        tipo.value = ''
        descricao.value = ''
        custo.value = ''
    } else exibirModal(false)

}

function exibirModal(sucesso){
    let modal = document.getElementById('modal')
    let header = document.getElementById('header-modal')
    let footer = document.getElementById('footer-modal')
    let conteudo = document.getElementById('conteudo-modal')
    let botao = document.getElementById('btn-modal')
   
    if(sucesso){
        modal.style.display= 'block'
        header.className += ' sucesso-modal'
        footer.className += ' sucesso-modal'
        conteudo.textContent = 'Registro realizado com sucesso!'
        botao.textContent = 'Ok'
    } else{
        modal.style.display= 'block'
        conteudo.textContent = `Erro na gravação! Campos em branco`
        botao.textContent = 'Corrigir'
    }
}
    
function esconderModal(){
    let modal = document.getElementById('modal')
    modal.style.display = 'none'
}

function clicarForaModal(element){
    window.onclick = function(event) {
        if (event.target == element) {
            esconderModal()
        }  
    }
}

function carregarRegistros(){
    let bd = new BD()
    let despesas = []

    despesas = bd.recuperarTodosRegistros()

    console.log(despesas)

    let listaDespesa = document.getElementById('lista-despesa')
    despesas.forEach((d)=>{
        let tableRow = listaDespesa.insertRow()
        tableRow.insertCell(0).textContent =`${d.dia}/${d.mes}/${d.ano}`
        tableRow.insertCell(1).textContent = d.tipo
        tableRow.insertCell(2).textContent = d.descricao
        tableRow.insertCell(3).textContent = `R$${d.custo}`
    }) 
}



class Despesa{
    constructor(dia,mes,ano,tipo,descricao,custo){
        this.dia = dia
        this.mes = mes
        this.ano = ano
        this.tipo = tipo
        this.descricao = descricao
        this.custo = custo
    }

    validarDados(){
        for(let chave in this){
            if(this[chave] === '' || this[chave] === null || this[chave] === undefined){
                return false
            }
        }

        return true
    }
}

class BD{
    constructor(){
        this.id = window.localStorage.getItem('id')
        
        if(this.id === null){
            window.localStorage.setItem('id', 0)
        }
    }
    
    novoId(){
        let id = parseInt(window.localStorage.getItem('id'))
        return id + 1
    }

    criarRegistro(desp){
        let id = this.novoId()
        window.localStorage.setItem(id, JSON.stringify(desp))
        window.localStorage.setItem('id',id)
    }

    recuperarTodosRegistros(){
        let id = window.localStorage.getItem('id')
        let despesas = []

        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(window.localStorage.getItem(i))

            if(despesa){
                despesas.push(despesa)
            }
        }

       return despesas
    }
}