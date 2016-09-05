(function() {
    var wheel = require('../../utils/base.js').wheel;

    wheel(
        'components.ui.TabsComponent',
        React.createClass({
            getInitialState: function() {
                var props = this.props;
                return {
                    activePage: ('activePage' in props) ? props.activePage : 0
                };
            },

            onSelectPage: function(activePage) {
                var state = this.state;
                state.activePage = activePage;
                this.setState(state);
            },

            render: function() {
                var state = this.state;
                var props = this.props;
                var pages = props.pages || [];
                var tabs  = {
                        type: 'ul',
                        props: {
                            className: 'tabs-titles'
                        },
                        children: []
                    },
                    content = {
                        props: {
                            className: 'tabs-content'
                        },
                        children: []
                    };

                for (var i = 0; i < (props.tools || []).length; i++) {
                    tabs.children.push(props.tools[i]);
                }

                var Content = React.createClass({
                        render: function() {
                            var props = this.props;
                            return utilsReact.fromJSON({
                                props: {
                                    className: 'tab-content' + (state.activePage === props.index ? ' active' : ''),
                                    ref:       props.ref
                                },
                                children: props.content
                            });
                        }
                    });

                for (var i = 0; i < pages.length; i++) {
                    (function(pageIndex, page) {
                        tabs.children.push({
                            type: 'li',
                            props: {
                                className: 'tab' + (state.activePage === pageIndex ? ' active' : ''),
                                innerHTML: page.title || ('page' + i),
                                onClick:   (function() { this.onSelectPage(pageIndex); }).bind(this)
                            }
                        });
                    }).call(this, i, pages[i]);

                    content.children.push({
                        type: Content,
                        props: {
                            index:   i,
                            ref:     (pages[i].ref || 'page' + i),
                            content: pages[i].content
                        }
                    });
                }

                return utilsReact.fromJSON({
                    props: {
                        className: 'tabs'
                    },
                    children: [tabs, content]
                });
            }
        })
    );
})();