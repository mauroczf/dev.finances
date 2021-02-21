const modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] 
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify)
    },
}
Storage.get()

const transactions = [
    {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'

    }, {

        description: 'WebSite',
        amount: 500000,
        date: '24/01/2021'

    }, {

        description: 'Internet',
        amount: -20000,
        date: '26/01/2021'
    }, {

        description: 'App',
        amount: 200000,
        date: '28/01/2021'
    }]
const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload();
    },

    remove(index) {
        Transaction.all.splice(index, 1)
    },

    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    },
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}
const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return Math.round(value)
    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-Br", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //captação e retorno dos valores do formulário
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },
    //formatação dos dados do formulário
    formatData() {
        console.log('Formatar os dados')
    },
    //validação dos campos (Descrição / Montante (Valor) / Data)
    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Preencha todos os campos!")
        }
    },
    //formatação dos valores (Descrição / Montante (Valor) / Data)
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
    },
    //limpando os dados do formulário
    clearFields(){
        Form.description.value = ""
        Form.value.value = ""
        Form.date.value = ""
    },
    saveTransaction(transaction){
        Transaction.add(transaction)
    },
    submit(event) {
        event.preventDefault();
        {
            try { 
                //Tente:
                Form.validateFields() 
                const transaction = Form.formatValues()
                //validar os dados e pegar uma transação formatada
                Form.saveTransaction(transaction)
                //adicionar transação
                Form.clearFields()
                //limpar os dados do formulário
                modal.close()
                //fechar o modal
                        
            } catch (error) {
                //caso algum campo esteja em branco = emitir msg de erro
                alert(error.message)
                //Erro ("Preencha todos os campos!") 
            }
        }
    },
}
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransactions(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index;
        
        DOM.transactionsContainer.appendChild(tr);

    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        <tr>
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação" 
            </td>
        </tr>`
        
        return html
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}
const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()
  
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
  }
  
  App.init()

