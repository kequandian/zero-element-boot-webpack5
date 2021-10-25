import { useSize } from 'ahooks';

const React = require('react');
import { useState, useEffect } from 'react';
const { NamedContainer, NamedLayout, NamedGateway, NamedCart } = require('@/components');
const DefaultContainer = require('@/components/container/Container')

const AutoComponent = require('@/components/AutoComponent');
import {get as NamedPresenterGet } from '@/components/config/NamedPresenterConfig';

//2012-04-02 copy autoLayout
const CloneAutoLayout = (props) => {
    if (props.children && Array.isArray(props.children) && props.children.length > 0) {
      return AutoComponent({layout:props, allComponents:NamedPresenterGet(), ...props});
    }
    return AutoLayout(props);

}

export {
    CloneAutoLayout
}


function AutoLayout({ children, layout, allComponents = NamedPresenterGet(), onItemClick = () => { console.log('未设置onItemClick点击事件') }, ...data }) {

  // handle layout, for children in {layout
  const { xname, props, container, gateway, cart, indicator, presenter } = layout || {};

  const _cart = (cart && typeof cart === 'string') ? { xname: cart } : cart
  const _gateway = (gateway && typeof gateway === 'string') ? { xname: gateway } : gateway
  
  const _indicator = (indicator && typeof indicator === 'string') ? { xname: indicator } : indicator


  // handle container
  const Container = container ? NamedContainer : DefaultContainer
  const _container = ((typeof container === 'string') ? { xname: container } : container) || {}

  // if layout contains childrenData, means this is for auto component
  const Presenter = presenter ? ( typeof presenter === 'string' ? allComponents[presenter] : isJsonObject(presenter) ? CloneAutoLayout : tips(presenter)) : null;

  function isJsonObject(obj) {
   if(typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]"){
     return true;
   }
   return false;
 }
  
  // restLayout means layout props
  // child iterator from children contains: [name, span, width, gateway, cart, [,seperator]]
  // <NamedList name='PlainList' {...config} onItemClick={onClick}>
  //     <NamedLayout>
  //         <NamedGateway name='Gateway'>
  //             <NamedCart name='ItemCart' props={{padding: '12px'}}> 
  //                 <UserItem />
  //             </NamedCart>
  //         </NamedGateway>
  //     </NamedLayout>
  // </NamedList>
  return <Container {..._container} {...data} onItemClick={onItemClick} >

    <NamedLayout xname={xname} props={props}>

      <NamedGateway {..._gateway}>
        {indicator ?
          <NamedCart {..._indicator}>
            {cart ?
              <NamedCart {..._cart} >
                {presenter ?
                  <Presenter {...presenter}/>
                  :
                  React.Children.toArray(children)
                }
              </NamedCart>
              :
              (presenter ?
                <Presenter {...presenter}/>
                :
                React.Children.toArray(children)
              )
            }
          </NamedCart> // end indicator
          :
          (cart ?
            <NamedCart {..._cart} >
              {presenter ?
                  <Presenter {...presenter}/>
                :
                React.Children.toArray(children)
              }
            </NamedCart>
            :
            (presenter ?
                <Presenter {...presenter}/>
              :
              React.Children.toArray(children)
            )
          )//cart?
        }
      </NamedGateway>

    </NamedLayout>
  </Container>
}


/**
 * 自动布局复合组件，自定义抽象参数如下说明
 * @param {*} props 
 * @param {布局} layout
 * @param {修饰} cart [shape, decorator, behavior, ...]
 * @param {分隔} seperator
 * @param {数据传递与绑定} gateway
 */
function _AutoLayout(config) {
  const { children, layout, allComponents = {}, onItemClick = () => { console.log('未设置onItemClick点击事件') }, items, ...data } = config;

  // handle layout, childrenData for children in {layout
  const { name, props, container, cart, gateway, presenter, ...childrenData } = layout || {};
  const _Container = container ? NamedContainer : Container
  const containerProps = (container && (typeof container === 'string' ? { name: container } : container)) || {}
  const _cart = cart
  const _gateway = gateway


  /// check childrenData for layout or item data for each child
  //  layout children first
  const hasChildrenData = childrenData && childrenData.children && Array.isArray(childrenData.children) && (childrenData.children.length > 0)
  const _children = hasChildrenData ? childrenData.children : items
  // console.log('AutoLayout items=',items)


  // if layout contains childrenData, means this is for auto component
  const Presenter = (hasChildrenData && presenter && (allComponents[presenter] || tips(presenter))) || React.Children.only(children)
  // console.log('allComponents=',allComponents,'Presenter=',Presenter )


  // restLayout means layout props
  // child iterator from children contains: [name, span, width, gateway, cart, [,seperator]]
  return <_Container {...containerProps} items={items} onItemClick={onItemClick}>
    <NamedLayout name={name} props={props} >
      {_children.map((child, i) => {
        const { name, span, gateway, cart } = child;
        const C = allComponents[name] || Presenter || tips(name);

        //get gateway name, use default gateway if child has no gateway defined
        const __gateway = gateway ? gateway : _gateway
        const gatewayName = __gateway ? (typeof __gateway === 'string' ? __gateway : __gateway.name) : 'Gateway'
        const gatewayProps = (__gateway && __gateway.props) || {}

        //get cart name
        const __cart = cart ? cart : _cart
        const cartName = __cart ? (typeof __cart === 'string' ? __cart : __cart.name) : ''
        const cartProps = (__cart && __cart.props) || {}

        // each item has its Named Gateway
        // {*} data will send down to NamedCart and then NamedCart to Child Component
        return <NamedGateway key={i} name={gatewayName} {...gatewayProps} {...data} span={span}>
          {cart ?
            <NamedCart key={i} name={cartName} {...cartProps} >
              <C />
            </NamedCart>
            :
            <C />}
        </NamedGateway>
      })}
    </NamedLayout>
  </_Container>
}


function tips(name) {
  return _ => `${name} 未定义`;
}
