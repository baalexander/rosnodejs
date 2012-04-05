# Hello

bool auto_disable_bodies           # enable auto disabling of bodies, default false
uint32 sor_pgs_iters               # inner iterations when using projected Gauss Seidel
float64 sor_pgs_w                  # relaxation parameter when using projected Gauss Seidel, 1 = no relaxation
float64 contact_surface_layer      # contact "dead-band" width
float64 contact_max_correcting_vel # contact maximum correction velocity
float64 cfm                        # global constraint force mixing
float64 erp                        # global error reduction parameter
uint32 max_contacts                # maximum contact joints between two geoms

constanttype1 CONSTANTNAME1=constantvalue1
constanttype2 CONSTANTNAME2=constantvalue2

int32 X=123
int32 Y=-123
string FOO=foo
string EXAMPLE="#comments" are ignored, and leading and trailing whitespace removed
