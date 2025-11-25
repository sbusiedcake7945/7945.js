class ComponentManager {
    constructor(client) {
        this.client = client;
        this.components = new Map();
    }
    
    button(customId, callback) {
        this.components.set(`button_${customId}`, {
            type: 'button',
            customId,
            callback
        });
        return this;
    }
    
    selectMenu(customId, callback) {
        this.components.set(`select_${customId}`, {
            type: 'select',
            customId,
            callback
        });
        return this;
    }
    
    modal(customId, callback) {
        this.components.set(`modal_${customId}`, {
            type: 'modal',
            customId,
            callback
        });
        return this;
    }
    
    handleInteraction(interaction) {
        const { custom_id } = interaction.data;
        const component = this.components.get(`button_${custom_id}`) || 
                         this.components.get(`select_${custom_id}`) ||
                         this.components.get(`modal_${custom_id}`);
        
        if (component) {
            component.callback(interaction);
        }
    }
}

module.exports = ComponentManager;