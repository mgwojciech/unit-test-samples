import * as React from 'react';
import styles from './PnPUnitTestSample.module.scss';
import { IPnPUnitTestSampleProps } from './IPnPUnitTestSampleProps';
import { SPFx, spfi, SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class PnPUnitTestSample extends React.Component<IPnPUnitTestSampleProps, {
  name: any,
  tech: any,
  employees: any[],
  isUpdate: boolean,
  empId: any,
  empIndex: any,
  blocking: boolean
}> {

  protected sp: SPFI;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      tech: '',
      employees: [],
      isUpdate: false,
      empId: '',
      empIndex: '',
      blocking: false
    };
    this.sp = spfi().using(SPFx(props.context));
    this.getEmployee();
    this.enterName = this.enterName.bind(this);
    this.enterTechnology = this.enterTechnology.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private enterName(event) {
    this.setState({ name: event.target.value });
  }

  private enterTechnology(event) {
    this.setState({ tech: event.target.value });
  }

  private handleSubmit(event) {
    this.addEmployee(this.state);
    event.preventDefault();
  }

  public render() {
    return (
        <div className={styles.pnPUnitTestSample}>
          <div>
            <div>
              <div>
                {/* <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p> */}
                <h4>Add Employee</h4>
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Employee Name</label>
                        <input type="text" className="form-control" placeholder="Enter name" value={this.state.name} onChange={this.enterName} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Technology</label>
                        <input type="text" className="form-control" placeholder="Enter Technology" value={this.state.tech} onChange={this.enterTechnology} />
                      </div>
                    </div>
                    {/* <input type="text" placeholder="Employee Name" value={this.state.name} onChange={this.enterName}></input>
                  <input type="text" style={{ marginLeft: 5 }} placeholder="Technology" value={this.state.tech} onChange={this.enterTechnology}></input>
                  <div style={{ marginTop: 5 }}>
                    <input type="submit" value="Submit" />
                  </div> */}
                  </div>
                </form>
                <button className="btn btn-primary mb-5" onClick={this.handleSubmit}>Submit</button>
                <h4>Employees</h4>
                <table className="table table-dark">
                  <tbody key="tableBody">
                    <tr key="headerRow">
                      <th>#</th>
                      <th>Name</th>
                      <th colSpan={2}>Technology</th>
                    </tr>
                    {
                      this.state.employees.map((ele, index) => {
                        return (
                          <tr key={ele.id}>
                            <td>{index + 1}</td>
                            <td>{ele.Title}</td>
                            <td>{ele.tech}</td>
                            <td style={{ color: 'while', cursor: 'pointer' }}><i className="fa fa-pencil" aria-hidden="true" onClick={() => this.updateEmployee(ele.ID, index)}></i></td>
                            <td style={{ color: 'while', cursor: 'pointer' }}><i className="fa fa-trash" style={{ color: 'while' }} aria-hidden="true" onClick={() => this.deleteEmployee(ele.ID, index)}></i></td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
                {/* <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a> */}
              </div>
            </div>
          </div>
        </div>
    );
  }

  private getEmployee() {
    return new Promise((resolve, reject) => {
      this.sp.web.lists.getByTitle('EmployeeList').items.select('ID, Title, tech')().then((result: any[]) => {
        console.log("get employees result", result);
        resolve(result);
        this.setState({
          employees: result
        });
      }).catch((err) => {
        console.log("error in get employees", err);
      });
    });
  }

  private addEmployee(state) {
    if (this.state.name && this.state.tech) {
      if (this.state.isUpdate) {
        this.setState({ blocking: true });
        return new Promise((resolve, reject) => {
          let data = {
            Title: state.name,
            tech: state.tech
          };
          this.sp.web.lists.getByTitle('EmployeeList').items.getById(this.state.empId).update(data).then((result: any) => {
            resolve(result);
            alert('Employee Updated');
            this.state.employees[this.state.empIndex].Title = data.Title;
            this.state.employees[this.state.empIndex].tech = data.tech;
            this.setState({ name: '', tech: '', isUpdate: false, empId: '', empIndex: '', blocking: false });
          }).catch((err) => {
            alert('Employee Not Updated');
            this.setState({ blocking: false });
            console.log("error in update employee", err);
          });
        });
      }
      else {
        this.setState({ blocking: true });
        return new Promise((resolve, reject) => {
          let data = {
            Title: state.name,
            tech: state.tech
          };
          this.sp.web.lists.getByTitle('EmployeeList').items.add(data).then((result: any) => {
            console.log("result from add employee", result);
            resolve(result);
            alert('Employee added');
            this.state.employees.push({
              ID: result.data.ID,
              Title: state.name,
              tech: state.tech
            });
            this.setState({ name: '', tech: '', blocking: false });
          }).catch((err) => {
            alert('Employee not added');
            this.setState({ blocking: false });
            console.log("error in add employee", err);
          });
        });
      }
    }
    else {
      alert("Enter Name and Technology");
    }
  }

  private updateEmployee(id, index) {
    this.setState({ blocking: true });
    return new Promise((resolve, reject) => {
      this.sp.web.lists.getByTitle('EmployeeList').items.getById(id)().then((result: any) => {
        console.log("get employee by id result", result);
        resolve(result);
        this.setState({
          name: result.Title,
          tech: result.tech,
          isUpdate: true,
          empId: id,
          empIndex: index,
          blocking: false
        });
      }).catch((err) => {
        this.setState({ blocking: false });
        console.log("error in get employee by id", err);
      });
    });
  }

  private deleteEmployee(id, index) {
    this.setState({ blocking: true });
    return new Promise((resolve, reject) => {
      this.sp.web.lists.getByTitle('EmployeeList').items.getById(id).delete().then((result: any) => {
        console.log("delete employee by id result", result);
        resolve(result);
        alert("Employee deleted");
        this.state.employees.splice(index, 1);
        this.setState({
          empId: '',
          empIndex: '',
          blocking: false
        });
      }).catch((err) => {
        this.setState({ blocking: false });
        console.log("error in delete employee by id", err);
      });
    });
  }

}