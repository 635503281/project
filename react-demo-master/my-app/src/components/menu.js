import React,{Component} from 'react'
import {NavLink as Link} from 'react-router-dom'
import './../css/menu.css'
class Menu extends Component {
    constructor(props){
        super(props);
        this.state={
            menuList=[
                {url:"/attendence",menuName:"通讯录"},
                {url:"/holiday",menuName:"假期管理"},
                {url:"/att",menuName:"考勤分组"},
                {url:"/member",menuName:"员工管理"},
                {url:"/department",menuName:"部门管理"},
            ],
        }
    }
    render(){
        return <ul className="g-menu">
            {this.state.menuList.map((value,index)=>{
                return <li key={index} className="nav"><Link to={value.url} activeClassName='g-navActive' className='link'>{value.menuName}</Link></li>
            })}
            {/* <li className="nav"><Link to={`/attendence`} activeClassName='g-navActive' className='link'>通讯录</Link></li>
            <li className="nav"><Link to={`/holiday`} activeClassName='g-navActive' className='link'>假期管理</Link></li>
            <li className="nav"><Link to={`/att`} activeClassName='g-navActive' className='link'>考勤分组</Link></li>
            <li className="nav"><Link to={`/member`} activeClassName='g-navActive' className='link'>员工管理</Link></li>
            <li className="nav"><Link to={`/department`} activeClassName='g-navActive' className='link'>部门管理</Link></li> */}
        </ul>
    }
}
export default Menu;