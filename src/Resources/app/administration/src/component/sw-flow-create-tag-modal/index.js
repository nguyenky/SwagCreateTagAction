import template from './sw-flow-create-tag-modal.html.twig';

const { Data: { Criteria, EntityCollection } } = Shopware;
const { Component, Context } = Shopware;

Component.register('sw-flow-create-tag-modal', {
    template,

    inject: [
        'repositoryFactory',
    ],

    props: {
        sequence: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            tagCollection: [],
        };
    },

    computed: {
        tagRepository() {
            return this.repositoryFactory.create('tag');
        },

        tagCriteria() {
            const criteria = new Criteria(1, 25);
            const { config } = this.sequence;
            const tagIds = Object.keys(config.tagIds);
            if (tagIds.length) {
                criteria.addFilter(Criteria.equalsAny('id', tagIds));
            }

            return criteria;
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.tagCollection = this.createTagCollection();

            const { config } = this.sequence;
            if (this.sequence.id && config?.tagIds) {
                this.getTagCollection();
            }
        },

        getTagCollection() {
            return this.tagRepository.search(this.tagCriteria)
                .then(tags => {
                    this.tagCollection = tags;
                })
                .catch(() => {
                    this.tagCollection = [];
                });
        },

        createTagCollection() {
            return new EntityCollection(
                this.tagRepository.route,
                this.tagRepository.entityName,
                Context.api,
            );
        },

        onClose() {
            this.$emit('modal-close');
        },

        onAddTag(data) {
            this.tagCollection.add(data);
        },

        onRemoveTag(data) {
            this.tagCollection.remove(data);
        },

        getConfig() {
            const tagIds = {};
            this.tagCollection.forEach(tag => {
                Object.assign(tagIds, {
                    [tag.id]: tag.name,
                });
            });

            return {
                tagIds,
            };
        },

        onAddAction() {
            const config = this.getConfig();
            const data = {
                ...this.sequence,
                config,
            };

            this.$emit('process-finish', data);
        },
    },
});
