const Store = require('electron-store')
const Clone = require('clone')
const OJD = window.OJD

class Mappings {
    constructor(config) {
        this.store = new Store()
        this.config = config
        this.mappings = this.store.get('mappings')
        window.ojdMappings = this.mappings
    }

    /*
		///////////////////////////
	 		Getters
	 	///////////////////////////
	*/

    getMappings() {
        return this.mappings
    }

    getMapping(id) {
        return this.mappings[id]
    }

    /*
		///////////////////////////
	 		Operators
	 	///////////////////////////
	*/

    /*
	 * create()
	 * @param integer id
	 * @param object mapping
	 * @return integer
	 * Updates a mapping by id.
	 */
    update(id, mapping) {
        this.mappings[id] = mapping
        this.save()
    }

    /*
	 * create()
	 * @return integer
	 * Creates a new blank template mapping.
	 */
    create() {
        const id = this.mappings.length // Will always be one ahead. Thanks zero index;
        const mapping = require(OJD.appendCwdPath('app/js/data/mapping.json'))
        this.mappings.push(mapping)
        this.save()
        return id
    }

    /*
	 * clone(id)
	 * @param integer id
	 * @return integer
	 * Creates a new mapping based on a previous mapping.
	 */
    clone(id) {
        const newId = this.mappings.length
        const mapping = Clone(this.getMapping(id))
        mapping.name += ' (Cloned)'
        this.mappings.push(mapping)
        this.save()
        return newId
    }

    /*
	 * remove(id)
	 * @param integer id
	 * @return integer
	 * Removes a mapping. If all are removed, a new one will be created in its place.
	 */
    remove(id) {
        this.mappings.splice(id, 1)
        if (this.mappings.length === 0) {
            this.create()
        }
        this.save()
        return 0
    }

    /*
	 * save()
	 * @return NULL
	 * Saves all mappings
	 */
    save() {
        this.store.set('mappings', this.mappings)
    }

    // Move to profile?
    reset() {
        $('*[ojd-directional]').css('top', '')
        $('*[ojd-directional]').css('left', '')
        $('*[ojd-directional]').removeClass('active')
        $('*[ojd-button]').removeClass('active')
        $('*[ojd-trigger-scale]').css('height', '')
        $('*[ojd-trigger-scale-inverted]').css('height', '')
        $('*[ojd-trigger]').removeClass('trigger-active')
        $('*[ojd-trigger-move]').css('top', '')
        $('*[ojd-trigger-move-inverted]').css('bottom', '')
        $('*[ojd-trigger-move-inverted]').css('top', '')
        $('*[ojd-arcade-directional]').css('top', '')
        $('*[ojd-arcade-directional]').css('left', '')
    }
}
module.exports.Mappings = Mappings


